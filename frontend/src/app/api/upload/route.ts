import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to base64 for IMGBB API
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const imgbbFormData = new URLSearchParams();
    imgbbFormData.append('image', base64Image);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await imgbbResponse.json();

    if (data.success) {
      return NextResponse.json({ url: data.data.url }, { status: 200 });
    } else {
      console.error('Imgbb error:', data);
      return NextResponse.json({ error: 'Failed to upload to image host' }, { status: 500 });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
