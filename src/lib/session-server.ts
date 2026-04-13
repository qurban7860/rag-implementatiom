/* eslint-disable @typescript-eslint/no-explicit-any */
/* Server-only session utils */
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const secretKey = process.env.GOOGLE_CLIENT_SECRET!; // Use client secret as JWT key

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieJar = await cookies();
    const token = cookieJar.get('auth-token')?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
    return payload as any as Session;
  } catch {
    return null;
  }
}

export async function createAuthToken(session: Session): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(secretKey));
}

