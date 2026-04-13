'use server'

import { ChatService } from '../service/chatService'
import { AIService } from '../service/aiService'
import { sendMessageSchema, createChatSessionSchema } from '../validation/chatValidation'
import { revalidatePath } from 'next/cache'

const chatService = new ChatService()
const aiService = new AIService()

export async function createChatSession(data: { userId: string; title?: string }) {
  const validated = createChatSessionSchema.parse(data)
  const session = await chatService.createChatSession(validated)
  revalidatePath('/chat')
  return session
}

export async function sendMessage(chatSessionId: string, message: string) {
  const validated = sendMessageSchema.parse({ chatSessionId, message })

  // Save user message
  await chatService.createMessage({ chatSessionId: validated.chatSessionId, role: 'user', content: validated.message })

  const messages = await chatService.getMessagesByChatSessionId(validated.chatSessionId)
  const messageHistory = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const stream = await aiService.generateResponse(messageHistory, { stream: true })

  // Convert OpenAI stream to web ReadableStream
  const encoder = new TextEncoder()
  let fullResponse = ''

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          fullResponse += content
          controller.enqueue(encoder.encode(content))
        }
      }
      // Save assistant message after streaming completes
      await chatService.createMessage({ chatSessionId: validated.chatSessionId, role: 'assistant', content: fullResponse })
      controller.close()
    },
  })

  revalidatePath(`/chat/${chatSessionId}`)
  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}