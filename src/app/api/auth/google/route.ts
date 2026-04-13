import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_CLIENT_ID } from '@/lib/env';

export async function GET(request: NextRequest) {
  const callbackUrl = new URL(request.url);
  const state = Math.random().toString(36).substring(7);
  callbackUrl.searchParams.set('state', state);
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!);
  googleAuthUrl.searchParams.set('redirect_uri', `${callbackUrl.origin}/api/auth/google/callback`);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('access_type', 'offline');

  return NextResponse.redirect(googleAuthUrl.toString());
}
