import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'team.json');

export async function getTeamData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading team data:', error);
    return { ceo: {}, members: [] };
  }
}

export async function saveTeamData(data: any) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const team = await getTeamData();
  const members = team.members || [];
  members.sort((a: any, b: any) => a.order - b.order);
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, designation, description, image, socialLinks } = body;
    
    if (!name || !designation) {
      return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
    }
    
    const team = await getTeamData();
    const members = team.members || [];
    const maxOrder = members.reduce((max: number, p: any) => Math.max(max, p.order || 0), 0);
    
    const newMember = {
      id: `team_${Date.now()}`,
      name,
      designation,
      description: description || '',
      image: image || '',
      socialLinks: socialLinks || { linkedin: '', email: '' },
      order: maxOrder + 1
    };
    
    team.members = [...members, newMember];
    await saveTeamData(team);
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
