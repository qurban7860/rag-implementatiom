import { getServerSession } from '@/lib/session-server';
import { redirect } from 'next/navigation';
import { ChatWindow } from '@/components/ChatWindow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default async function ChatPage() {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="text-zinc-600">Powered by GPT-4 with streaming responses</p>
        </header>
        <ChatWindow userId={session.user.id} />
      </div>
    </QueryClientProvider>
  );
}
