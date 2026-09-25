import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const members = await (TeamMember.find as any)({ isCeo: false }).sort({ order: 1 });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, officialTitle, functionalDesignation, section, department, bio, image, socialLinks } = body;
    
    if (!name || !officialTitle) {
      return NextResponse.json({ error: 'Name and official title are required' }, { status: 400 });
    }
    
    const maxOrderDoc = await (TeamMember.findOne as any)({ isCeo: false } as any).sort({ order: -1 }).select('order');
    const order = maxOrderDoc && maxOrderDoc.order !== undefined ? maxOrderDoc.order + 1 : 1;
    
    // In our model, we named it 'photoUrl' but the frontend might be sending 'image' 
    // We should map it properly
    const photoUrl = image || body.photoUrl || '';
    // Position might be missing in payload, fallback to officialTitle
    const position = body.position || officialTitle;

    const newMember = await TeamMember.create({
      name,
      position,
      officialTitle,
      functionalDesignation: functionalDesignation || '',
      section: section || 'Board of Directors',
      department: department || '',
      bio: bio || '',
      photoUrl,
      socialLinks: socialLinks || { linkedin: '', email: '', whatsapp: '' },
      order,
      isCeo: false
    });
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
