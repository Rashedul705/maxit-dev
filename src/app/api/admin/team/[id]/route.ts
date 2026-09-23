import { NextResponse } from 'next/server';
import { getTeamData, saveTeamData } from '../route';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, designation, description, image, socialLinks } = body;
    
    if (!name || !designation) {
      return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
    }
    
    const team = await getTeamData();
    const members = team.members || [];
    const index = members.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    members[index] = {
      ...members[index],
      name,
      designation,
      description: description || '',
      image: image || members[index].image, // retain old if empty
      socialLinks: socialLinks || members[index].socialLinks
    };
    
    team.members = members;
    await saveTeamData(team);
    
    return NextResponse.json(members[index]);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const team = await getTeamData();
    const members = team.members || [];
    const filteredMembers = members.filter((p: any) => p.id !== id);
    
    if (members.length === filteredMembers.length) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    team.members = filteredMembers;
    await saveTeamData(team);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
