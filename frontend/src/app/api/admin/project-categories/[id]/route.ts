export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectCategory from '@/models/ProjectCategory';
import Project from '@/models/Project';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const body = await request.json();

    const category = await (ProjectCategory.findById as any)(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const oldName = category.name;

    const updatedCategory = await (ProjectCategory.findByIdAndUpdate as any)(
      id,
      { $set: body },
      { new: true, runValidators: true } as any
    );

    if (body.name && body.name !== oldName) {
      // Update all projects that have this category
      await (Project.updateMany as any)(
        { category: oldName },
        { $set: { category: body.name } }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    
    const deletedCategory = await (ProjectCategory.findByIdAndDelete as any)(id as any);

    if (!deletedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
