import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        error: { 
          message: 'Email dan password harus diisi',
          type: 'validation'
        } 
      }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    // Check if email exists
    if (!user) {
      return NextResponse.json({ 
        error: { 
          message: 'Email tidak ditemukan',
          type: 'email'
        } 
      }, { status: 401 });
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ 
        error: { 
          message: 'Akun Anda tidak aktif. Hubungi administrator.',
          type: 'account'
        } 
      }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: { 
          message: 'Password salah',
          type: 'password'
        } 
      }, { status: 401 });
    }

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_active: user.is_active
    };

    return NextResponse.json({ data: userData });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ 
      error: { 
        message: 'Terjadi kesalahan sistem. Silakan coba lagi.',
        type: 'system'
      } 
    }, { status: 500 });
  }
}