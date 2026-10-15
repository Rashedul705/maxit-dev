import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    
    // Map image to photoUrl if present
    if (body.image) {
      body.photoUrl = body.image;
    }
    
    // Sync position with officialTitle if not present
    if (!body.position && body.officialTitle) {
      body.position = body.officialTitle;
    }
    
    console.log(`Updating member with ID: ${id}`);
    
    const member = await (TeamMember.findByIdAndUpdate as any)(id as any, body, { new: true } as any);
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const member = await (TeamMember.findByIdAndDelete as any)(id as any);
    
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
