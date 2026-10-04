import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamSection from '@/models/TeamSection';

export async function GET() {
  try {
    await dbConnect();
    const sections = await TeamSection.find({}).sort({ order: 1 });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const section = await TeamSection.create(body);
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
