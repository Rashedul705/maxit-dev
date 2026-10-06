import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamSection from '@/models/TeamSection';
import TeamMember from '@/models/TeamMember';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await req.json();

    const existingSection = await (TeamSection as any).findById(id);
    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const oldName = existingSection.name;
    const newName = body.name;

    const section = await (TeamSection as any).findByIdAndUpdate(id, body, { new: true });
    
    // Update all team members associated with this section if the name changed
    if (newName && oldName !== newName) {
      await (TeamMember.updateMany as any)({ section: oldName }, { $set: { section: newName } });
    }
    
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const section = await (TeamSection as any).findByIdAndDelete(id);
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
