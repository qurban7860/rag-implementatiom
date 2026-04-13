import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChatService } from '@/features/chat/service/chatService'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const chatService = new ChatService()
  const sessions = await chatService.getChatSessionsByUserId(session.user.id)
  return NextResponse.json(sessions)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const chatService = new ChatService()
  const newSession = await chatService.createChatSession({ userId: session.user.id, title: body.title })
  return NextResponse.json(newSession)
}