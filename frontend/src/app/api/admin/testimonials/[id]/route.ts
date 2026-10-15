import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const body = await request.json();

    const updated = await (Testimonial.findByIdAndUpdate as any)(
      id,
      { $set: body },
      { new: true, runValidators: true } as any
    );

    if (!updated) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const deleted = await (Testimonial.findByIdAndDelete as any)(id as any);

    if (!deleted) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
