import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LegalPage from '@/models/LegalPage';

export async function GET() {
  try {
    await dbConnect();
    let legal = await (LegalPage.findOne as any)().lean();
    if (!legal) {
      legal = {
        privacyPolicy: 'Privacy Policy content goes here...',
        termsOfService: 'Terms of Service content goes here...'
      };
    }
    return NextResponse.json(legal);
  } catch (error) {
    console.error('Error fetching legal pages:', error);
    return NextResponse.json({ error: 'Failed to fetch legal pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let legal = await (LegalPage.findOne as any)();
    if (legal) {
      legal.privacyPolicy = body.privacyPolicy;
      legal.termsOfService = body.termsOfService;
      await legal.save();
    } else {
      legal = await LegalPage.create(body);
    }

    return NextResponse.json(legal);
  } catch (error) {
    console.error('Error saving legal pages:', error);
    return NextResponse.json({ error: 'Failed to save legal pages' }, { status: 500 });
  }
}
