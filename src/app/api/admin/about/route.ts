import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';

export async function GET() {
  try {
    await dbConnect();
    // Since there's only one about section content, we just find the first one
    let about = await AboutContent.findOne().lean();
    
    // If it doesn't exist, return a default template
    if (!about) {
      about = {
        journey: "Founded with a passion for innovation, MaxIT Solution began with a simple goal: to make industrial-grade engineering and sustainable energy accessible.",
        mission: "To empower businesses, industries, and communities by delivering robust, scalable, and sustainable technology solutions.",
        vision: "To be the region's most trusted engineering and technology partner, driving the transition towards smart automation.",
      };
    }
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { journey, mission, vision } = body;

    // Find the first document and update it, or create a new one if none exists
    const updatedAbout = await AboutContent.findOneAndUpdate(
      {} as any,
      { $set: { journey, mission, vision } },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updatedAbout);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
