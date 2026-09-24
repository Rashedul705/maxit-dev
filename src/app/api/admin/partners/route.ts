import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
import { triggerPDFRegeneration } from '@/lib/pdfGenerator';

const dataFilePath = path.join(process.cwd(), 'data', 'partners.json');

async function getPartnersData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading partners data:', error);
    // Return empty array if file doesn't exist
    return [];
  }
}

async function savePartnersData(data: any) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  
  const partners = await getPartnersData();
  
  let filteredPartners = partners;
  if (section === 'home' || section === 'profile') {
    filteredPartners = partners.filter((p: any) => p.section === section);
  }
  
  // Sort by order
  filteredPartners.sort((a: any, b: any) => a.order - b.order);
  
  return NextResponse.json(filteredPartners);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, section, logo, description } = body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.length > 30) {
      return NextResponse.json({ error: 'Name must be 30 characters or less' }, { status: 400 });
    }
    if (section !== 'home' && section !== 'profile') {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }
    
    const partners = await getPartnersData();
    
    // Get max order for the section
    const sectionPartners = partners.filter((p: any) => p.section === section);
    const maxOrder = sectionPartners.reduce((max: number, p: any) => Math.max(max, p.order), 0);
    
    const newPartner = {
      id: `${section}_${Date.now()}`,
      name: name.trim(),
      section,
      order: maxOrder + 1,
      ...(logo && { logo }),
      ...(description && { description })
    };
    
    partners.push(newPartner);
    await savePartnersData(partners);
    
    triggerPDFRegeneration();
    
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
