/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify, SignJWT } from 'jose';

const secretKey = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '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';

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export async function getClientSession(): Promise<Session | null> {
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    if (!token) return null;

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
    return payload as any as Session;
  } catch {
    return null;
  }
}

