import { getServerSession } from '@/lib/session-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await getServerSession()
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/chat') || pathname.startsWith('/api/chat')) {
    if (!session?.user?.id) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*', '/api/chat/:path*'],
}
