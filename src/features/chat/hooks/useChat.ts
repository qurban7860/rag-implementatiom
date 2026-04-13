import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createChatSession, sendMessage } from '../actions/chatActions'

export function useChatSessions(userId: string) {
  return useQuery({
    queryKey: ['chatSessions', userId],
    queryFn: async () => {
      const res = await fetch('/api/chat/sessions')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: !!userId,
  })
}

export function useCreateChatSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] })
    },
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ chatSessionId, message }: { chatSessionId: string; message: string }) => sendMessage(chatSessionId, message),
    onSuccess: (_, { chatSessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['chatSession', chatSessionId] })
    },
  })
}