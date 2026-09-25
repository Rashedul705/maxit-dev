import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const listType = searchParams.get('listType');
    
    let query = {};
    if (listType === 'homepage' || listType === 'company-profile') {
      query = { listType };
    }
    
    const partners = await Partner.find(query).sort({ order: 1 });
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, listType, logo, description } = body;
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (listType !== 'homepage' && listType !== 'company-profile') {
      return NextResponse.json({ error: 'Invalid listType' }, { status: 400 });
    }
    
    const maxOrderDoc = await Partner.findOne({ listType }).sort({ order: -1 }).select('order');
    const order = maxOrderDoc && maxOrderDoc.order !== undefined ? maxOrderDoc.order + 1 : 1;
    
    const partner = await Partner.create({
      name: name.trim(),
      listType,
      order,
      ...(logo && { logo }),
      ...(description && { description })
    });
    
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
