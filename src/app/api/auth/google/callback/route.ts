import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/lib/env';
import { UserService } from '@/features/user/service/userService';
import { createAuthToken } from '@/lib/session-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const callbackUrl = searchParams.get('callbackUrl') || '/chat';

  if (!code) {
    const errorUrl = new URL('/auth/signin', request.url);
    errorUrl.searchParams.append('error', 'OAuthSignin');
    errorUrl.searchParams.append('callbackUrl', callbackUrl);
    return NextResponse.redirect(errorUrl);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error('No access token');

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const googleUser = await userResponse.json();

    // Sync with DB
    const userService = new UserService();
    const user = await userService.findOrCreate({
      email: googleUser.email!,
      name: googleUser.name,
    });

    // Create JWT
    const sessionToken = await createAuthToken({
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
      }
    });

    const response = NextResponse.redirect(new URL(callbackUrl, request.url));
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    const errorUrl = new URL('/auth/signin', request.url);
    errorUrl.searchParams.set('error', 'OAuthCallback');
    errorUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(errorUrl);
  }
}
