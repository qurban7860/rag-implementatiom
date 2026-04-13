/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const secretKey = process.env.GOOGLE_CLIENT_SECRET!; 

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

export async function getClientSession(cookiesString: string): Promise<Session | null> {
  try {
    const token = cookiesString.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    if (!token) return null;

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
    return payload as any as Session;
  } catch {
    return null;
  }
}

export async function createAuthToken(session: Session) {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(secretKey));
}

export type ClientSession = Awaited<ReturnType<typeof getClientSession>>;

