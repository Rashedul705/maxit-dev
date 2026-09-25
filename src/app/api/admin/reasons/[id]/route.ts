import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reason from '@/models/Reason';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const body = await request.json();

    const updated = await Reason.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Reason not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating reason:', error);
    return NextResponse.json({ error: 'Failed to update reason' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const deleted = await Reason.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Reason not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Reason deleted successfully' });
  } catch (error) {
    console.error('Error deleting reason:', error);
    return NextResponse.json({ error: 'Failed to delete reason' }, { status: 500 });
  }
}
