import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let ceo = await TeamMember.findOne({ isCeo: true });
    return NextResponse.json(ceo || {});
  } catch (error) {
    console.error('Error fetching CEO:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, nickname, officialTitle, functionalDesignation, image, message, socialLinks } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    let ceo = await TeamMember.findOne({ isCeo: true });
    
    const updateData = {
      name,
      nickname: nickname || '',
      position: officialTitle || 'CEO',
      officialTitle: officialTitle || '',
      functionalDesignation: functionalDesignation || '',
      photoUrl: image || body.photoUrl || '',
      message: message || '',
      socialLinks: socialLinks || { linkedin: '', email: '' },
      isCeo: true
    };
    
    if (ceo) {
      ceo = await TeamMember.findByIdAndUpdate(ceo._id, updateData, { new: true });
    } else {
      ceo = await TeamMember.create(updateData);
    }
    
    return NextResponse.json(ceo);
  } catch (error) {
    console.error('Error updating CEO:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
