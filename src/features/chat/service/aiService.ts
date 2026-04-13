/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class AIService {
  async generateResponse(
    messages: Message[],
    options: {
      model?: string
      stream?: boolean
      temperature?: number
    } = {}
  ) {
    const {
      model = 'gpt-4',
      stream = false,
      temperature = 0.7,
    } = options

    // Add system prompt for AI SaaS context
    const systemMessage: Message = {
      role: 'system',
      content: 'You are a helpful AI assistant in a SaaS application. Provide clear, concise, and accurate responses.',
    }

    const allMessages = [systemMessage, ...messages]

    if (stream) {
      const streamCompletion = await openai.chat.completions.create({
        model,
        messages: allMessages,
        stream: true,
        temperature,
      })
      return streamCompletion
    } 

    const chatCompletion = await openai.chat.completions.create({
      model,
      messages: allMessages,
      stream: false,
      temperature,
    }) as any

    return chatCompletion.choices[0]?.message?.content || ''

  }

  // Placeholder for RAG implementation
  async generateResponseWithRAG(
    query: string,
    context: string[],
    messages: Message[],
    stream: boolean = false
  ) {
    // TODO: Implement RAG logic
    const enhancedMessages = [
      ...messages,
      {
        role: 'system' as const,
        content: `Context: ${context.join('\n')}`,
      },
      {
        role: 'user' as const,
        content: query,
      },
    ]
    return this.generateResponse(enhancedMessages, { stream })
  }

  // Placeholder for tool calling
  async generateResponseWithTools(
    messages: Message[],
    tools: any[],
    stream: boolean = false
  ) {
    // TODO: Implement tool calling
    return this.generateResponse(messages, { stream })
  }
}