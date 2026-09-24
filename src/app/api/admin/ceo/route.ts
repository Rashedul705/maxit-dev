import { NextResponse } from 'next/server';
import { getTeamData, saveTeamData } from '../team/route';
import { triggerPDFRegeneration } from '@/lib/pdfGenerator';

export const dynamic = 'force-dynamic';

export async function GET() {
  const team = await getTeamData();
  return NextResponse.json(team.ceo || {});
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, nickname, officialTitle, functionalDesignation, image, message, socialLinks } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const team = await getTeamData();
    
    team.ceo = {
      ...team.ceo,
      name,
      nickname: nickname || team.ceo.nickname || '',
      officialTitle: officialTitle || team.ceo.officialTitle || '',
      functionalDesignation: functionalDesignation || team.ceo.functionalDesignation || '',
      image: image || team.ceo.image || '',
      message: message || team.ceo.message || '',
      socialLinks: socialLinks || team.ceo.socialLinks || { linkedin: '', email: '' }
    };
    
    await saveTeamData(team);
    
    triggerPDFRegeneration();
    
    return NextResponse.json(team.ceo);
  } catch (error) {
    console.error('Error updating CEO:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
