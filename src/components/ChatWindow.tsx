/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, X } from "lucide-react";
import { useChatSessions, useCreateChatSession, useSendMessage } from "@/features/chat/hooks/useChat";
import { Session } from "@/features/chat/types/chatTypes";

export function ChatWindow({ userId }: { userId: string }) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: chatSessionsData } = useChatSessions(userId);
  const createSessionMutation = useCreateChatSession();
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    setSessions(chatSessionsData || []);
  }, [chatSessionsData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSessionId || isStreaming) return;

    const tempId = `temp-${Date.now()}`;
    const userMsg = { id: tempId, role: "user", content: newMessage };
    
    // Optimistic update
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const response = await sendMessageMutation.mutateAsync({ 
        chatSessionId: selectedSessionId, 
        message: newMessage 
      });

      // Stream response
      const reader = response.body?.getReader();
      let assistantContent = "";
      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg = { id: assistantId, role: "assistant", content: "" };

      setMessages(prev => [...prev, assistantMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          assistantContent += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantId 
              ? { ...msg, content: assistantContent }
              : msg
          ));
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      setIsStreaming(false);
      setNewMessage("");
    }
  };

  const createNewSession = () => {
    createSessionMutation.mutate({ userId, title: "New Chat" });
  };

  const selectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // Load messages for selected session
    // Implementation depends on query for messages
  };

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 p-4">
        <div className="flex gap-2 mb-4">
          <Button 
            size="sm" 
            onClick={createNewSession}
            disabled={createSessionMutation.isPending}
            className="flex-1"
          >
            New Chat
          </Button>
        </div>
        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-auto">
          {sessions.map(session => (
            <Button
              key={session.id}
              variant={selectedSessionId === session.id ? "default" : "ghost"}
              className="w-full justify-start h-12 p-3 text-left"
              onClick={() => selectSession(session.id)}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium truncate">{session.title || "New Chat"}</span>
                <span className="text-xs text-zinc-500 truncate w-full">{session.messages.length} messages</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-auto">
          {selectedSessionId ? (
            messages.map(msg => (
              <div key={msg.id} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-2xl max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">
              Select a chat or create a new one
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isStreaming}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isStreaming || !selectedSessionId}
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
