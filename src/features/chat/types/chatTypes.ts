export interface CreateChatSessionDto {
  userId: string
  title?: string
}

export interface SendMessageDto {
  chatSessionId: string
  message: string
}

export interface ChatSessionDto {
  id: string
  userId: string
  title?: string
  createdAt: Date
  updatedAt: Date
  messages: MessageDto[]
}

export interface MessageDto {
  id: string
  chatSessionId: string
  role: string
  content: string
  createdAt: Date
}

export type Session = ChatSessionDto;

