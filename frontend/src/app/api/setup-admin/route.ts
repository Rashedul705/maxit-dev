import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

// This is a one-time setup route. It will only create an admin if ZERO admins exist in the DB.
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await dbConnect();
    
    // Check if any admin exists
    const count = await Admin.countDocuments();
    if (count > 0) {
       return NextResponse.json({ error: "Admins already exist. Setup route is disabled for security." }, { status: 403 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the first admin
    const admin = await Admin.create({
      email,
      password: hashedPassword
    });

    return NextResponse.json({ message: "Admin created successfully", email: admin.email });
  } catch (error) {
    console.error('Setup Admin Error:', error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
