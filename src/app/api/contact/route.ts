import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { sendContactEmail } from '@/lib/mailer';

// Simple in-memory rate limiting for the contact route
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    
    if (now - rateData.timestamp > RATE_LIMIT_WINDOW) {
      rateData.count = 1;
      rateData.timestamp = now;
    } else {
      rateData.count++;
      if (rateData.count > MAX_REQUESTS) {
        return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
      }
    }
    rateLimitMap.set(ip, rateData);

    const { name, email, message: body, honeypot } = await req.json();

    if (honeypot) {
      // Spam detected via honeypot
      return NextResponse.json({ success: true }); // pretend it succeeded
    }

    if (!name || !email || !body) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    await dbConnect();

    // 1. Save to Database
    let conversation = await Conversation.findOne({ email });

    if (!conversation) {
      conversation = new Conversation({
        name,
        email,
        status: 'new',
        unreadCount: 1,
      });
    } else {
      conversation.status = 'open';
      conversation.unreadCount += 1;
      conversation.name = name; // Update name in case they changed it
      conversation.lastMessageAt = new Date();
    }
    
    await conversation.save();

    const newMessage = new Message({
      conversationId: conversation._id,
      direction: 'incoming',
      body,
    });
    
    await newMessage.save();

    // 2. Send Email Notification
    try {
      await sendContactEmail(name, email, body);
    } catch (emailError) {
      console.error('Failed to send SMTP email notification:', emailError);
      // We don't fail the request if the email fails, since the DB save succeeded
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
