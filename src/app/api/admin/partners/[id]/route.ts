import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { triggerPDFRegeneration } from '@/lib/pdfGenerator';

const dataFilePath = path.join(process.cwd(), 'data', 'partners.json');

async function getPartnersData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading partners data:', error);
    return [];
  }
}

async function savePartnersData(data: any) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, logo, description } = body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.length > 30) {
      return NextResponse.json({ error: 'Name must be 30 characters or less' }, { status: 400 });
    }
    
    const partners = await getPartnersData();
    const index = partners.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    
    partners[index].name = name.trim();
    if (logo !== undefined) {
      partners[index].logo = logo;
    }
    if (description !== undefined) {
      partners[index].description = description;
    }
    await savePartnersData(partners);
    
    triggerPDFRegeneration();
    
    return NextResponse.json(partners[index]);
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const partners = await getPartnersData();
    const filteredPartners = partners.filter((p: any) => p.id !== id);
    
    if (partners.length === filteredPartners.length) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    
    await savePartnersData(filteredPartners);
    
    triggerPDFRegeneration();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
