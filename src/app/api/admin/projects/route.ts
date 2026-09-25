import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await (Project.find as any)({}).sort({ order: 1 }).lean();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, description, shortDescription, category, client, date, technologies, imageUrl, order } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json({ error: 'Title, description, and imageUrl are required' }, { status: 400 });
    }

    const newProject = await Project.create({
      title,
      description,
      shortDescription,
      category,
      client,
      date,
      technologies,
      imageUrl,
      order: order || 0
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
