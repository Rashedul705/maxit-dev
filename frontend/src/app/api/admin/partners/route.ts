import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();
    let query = {};
    const partners = await (Partner.find as any)(query).sort({ order: 1 });
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
    const { name, logo, description } = body;
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const maxOrderDoc = await (Partner.findOne as any)().sort({ order: -1 }).select('order');
    const order = maxOrderDoc && maxOrderDoc.order !== undefined ? maxOrderDoc.order + 1 : 1;
    
    const partner = await Partner.create({
      name: name.trim(),
      listType: 'global',
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
