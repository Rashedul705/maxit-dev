import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Map image to photoUrl if present
    if (body.image) {
      body.photoUrl = body.image;
    }
    
    const member = await TeamMember.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const member = await TeamMember.findByIdAndDelete(params.id);
    
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
