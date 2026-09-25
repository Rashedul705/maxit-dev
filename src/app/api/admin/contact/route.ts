import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GlobalContact from '@/models/GlobalContact';

export async function GET() {
  try {
    await dbConnect();
    let contact = await (GlobalContact.findOne as any)().lean();
    if (!contact) {
      contact = {
        addressLine1: '2nd Floor, Afroza Tower,',
        addressLine2: 'Uposhohor Newmarket,',
        addressLine3: 'Rajshahi-6000',
        phoneNumber: '+88 01733-272445',
        email: 'sales@m4xit.com',
        facebookUrl: '#',
        linkedinUrl: '#',
        githubUrl: '#'
      };
    }
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching global contact:', error);
    return NextResponse.json({ error: 'Failed to fetch global contact' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let contact = await (GlobalContact.findOne as any)();
    if (contact) {
      contact.addressLine1 = body.addressLine1;
      contact.addressLine2 = body.addressLine2;
      contact.addressLine3 = body.addressLine3;
      contact.phoneNumber = body.phoneNumber;
      contact.email = body.email;
      contact.facebookUrl = body.facebookUrl;
      contact.linkedinUrl = body.linkedinUrl;
      contact.githubUrl = body.githubUrl;
      await contact.save();
    } else {
      contact = await GlobalContact.create(body);
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error saving global contact:', error);
    return NextResponse.json({ error: 'Failed to save global contact' }, { status: 500 });
  }
}
