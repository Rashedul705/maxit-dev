import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reason from '@/models/Reason';

export async function GET() {
  try {
    await dbConnect();
    const docs = await (Reason.find as any)({}).sort({ order: 1 }).lean();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error fetching reasons:', error);
    return NextResponse.json({ error: 'Failed to fetch reasons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, description, iconCategory, gradient, order } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newReason = await Reason.create({
      title,
      description,
      iconCategory: iconCategory || 'Settings',
      gradient: gradient || 'from-blue-400 to-indigo-500',
      order: order || 0
    });

    return NextResponse.json(newReason, { status: 201 });
  } catch (error) {
    console.error('Error creating reason:', error);
    return NextResponse.json({ error: 'Failed to create reason' }, { status: 500 });
  }
}
