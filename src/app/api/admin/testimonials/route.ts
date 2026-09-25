import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await dbConnect();
    const docs = await Testimonial.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, company, testimonial, rating, imageUrl, order } = body;

    if (!name || !testimonial || !imageUrl) {
      return NextResponse.json({ error: 'Name, testimonial, and imageUrl are required' }, { status: 400 });
    }

    const newTestimonial = await Testimonial.create({
      name,
      company,
      testimonial,
      rating,
      imageUrl,
      order: order || 0
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
