import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET() {
  try {
    await dbConnect();
    const services = await (Service.find as any)({}).sort({ order: 1 }).lean();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, description, iconCategory, imageUrl, order } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newService = await Service.create({
      title,
      description,
      iconCategory: iconCategory || 'Settings',
      imageUrl: imageUrl || '',
      order: order || 0
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
