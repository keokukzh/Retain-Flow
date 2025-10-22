import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For static export, we'll use mock authentication
    // In production, this would connect to your database
    const mockUsers = [
      {
        id: 'demo-user-1',
        email: 'demo@retainflow.com',
        password: 'demo123',
        emailVerified: true,
        createdAt: new Date(),
      },
      {
        id: 'demo-user-2',
        email: 'test@retainflow.com',
        password: 'test123',
        emailVerified: true,
        createdAt: new Date(),
      },
    ];

    // Find user by email
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password (simple comparison for demo)
    if (password !== user.password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { message: 'Please verify your email before logging in' },
        { status: 401 }
      );
    }

    // Generate mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
