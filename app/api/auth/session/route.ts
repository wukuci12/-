import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 从cookie获取token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // 获取用户信息
    const user = await getUserFromToken(token);

    if (!user) {
      // token无效，清除cookie
      const response = NextResponse.json({ user: null });
      response.cookies.delete('auth_token');
      return response;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        level: user.level,
        points: user.points,
        streak: user.streak,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Session error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}