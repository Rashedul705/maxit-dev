import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroContent from '@/models/HeroContent';

export async function GET() {
  try {
    await dbConnect();
    let content = await (HeroContent.findOne as any)().lean();
    if (!content) {
      // Return default values if nothing in DB yet
      content = {
        brandingText: 'MAXIT',
        titleLine1: 'Solar Energy &',
        titleLine2: 'Smart Automation',
        description: 'Empowering your future with sustainable energy solutions, advanced agro-technology, and intelligent industrial automation.',
        stats: [
          { end: 50, suffix: '+', label: 'Projects' },
          { end: 30, suffix: '+', label: 'Clients' },
          { end: 10, suffix: '+', label: 'Years Exp' },
          { end: 24, suffix: '/7', label: 'Support' }
        ]
      };
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json({ error: 'Failed to fetch hero content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Upsert since it's a singleton
    let content = await (HeroContent.findOne as any)();
    if (content) {
      content.brandingText = body.brandingText;
      content.titleLine1 = body.titleLine1;
      content.titleLine2 = body.titleLine2;
      content.description = body.description;
      content.stats = body.stats;
      await content.save();
    } else {
      content = await HeroContent.create(body);
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error saving hero content:', error);
    return NextResponse.json({ error: 'Failed to save hero content' }, { status: 500 });
  }
}
