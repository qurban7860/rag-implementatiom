export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center justify-center text-center px-4 py-16 max-w-2xl mx-auto">
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI Chat App
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Sign in to start chatting with GPT-4 powered conversations. 
            Multiple sessions, streaming responses, and persistent history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/chat"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Chatting
            </a>
              <a
              href="/auth/signin"
              className="px-8 py-4 border-2 border-gray-200 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </a>
          </div>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Powered by Next.js 14 • OpenAI GPT-4 • Prisma</p>
        </div>
      </main>
    </div>
  );
}
