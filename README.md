# AI SaaS Chat App

Modern, type-safe Next.js 14+ AI chat application with session management, streaming responses, Google OAuth, and Prisma ORM. Production-ready architecture with feature-sliced design.

## ✨ Features

- **Multi-session Chat**: Create/manage multiple chat sessions per user
- **Streaming Responses**: Real-time OpenAI GPT-4 responses
- **Google OAuth**: Secure user authentication with NextAuth.js
- **Prisma ORM**: Type-safe database with PostgreSQL/MySQL/SQLite
- **TypeScript**: Full end-to-end typesafety
- **React Query**: Optimistic updates, infinite queries, caching
- **shadcn/ui**: Beautiful, accessible UI components
- **Server Actions**: Secure API routes with Zod validation

## 🏗️ Architecture

```
src/
├── app/                 # Next.js App Router
├── components/          # UI components (shadcn/ui)
├── features/            # Feature-sliced organization
│   ├── chat/           # Chat feature (hooks, services, types)
│   └── user/           # User feature (CRUD operations)
├── lib/                # Shared utilities (auth, prisma, queryClient)
└── types/              # Global TypeScript declarations
```

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo>
cd ai-saas-app
npm install
```

### 2. Environment Variables
Copy `.env.example` → `.env.local`:
```
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL="your_database_url"
```

### 3. Database Setup
```bash
npx prisma db push
# or
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000/chat](http://localhost:3000/chat)

## 📚 Project Structure

### Features (Domain-Driven)
```
features/
└── chat/
    ├── actions/           # Server Actions (chatActions.ts)
    ├── hooks/             # React Query hooks (useChat.ts)
    ├── repository/        # Data access layer
    ├── service/           # Business logic (aiService.ts, chatService.ts)
    ├── types/             # DTOs & types
    └── validation/        # Zod schemas
```

### Key Implementation Details

**Chat Flow:**
1. `ChatWindow.tsx` → `useChatSessions()` → API `/api/chat/sessions`
2. `sendMessageMutation` → `chatActions.sendMessage()` → `chatService`
3. `aiService.generateResponse()` → OpenAI streaming
4. Optimistic UI updates + real-time streaming

**Auth Flow:**
1. Google OAuth → NextAuth callbacks
2. `userService.findOrCreate()` → Upsert user
3. JWT session with user ID

## 🛠️ Development Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript
npm run prisma:studio # DB viewer
```

## 🔍 Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  chats     ChatSession[]
}

model ChatSession {
  id        String   @id @default(cuid())
  userId    String
  title     String?
  messages  Message[]
  user      User     @relation(fields: [userId], references: [id])
}

model Message {
  id             String     @id @default(cuid())
  chatSessionId  String
  role           String
  content        String
  chatSession    ChatSession @relation(fields: [chatSessionId], references: [id])
}
```

## 🌟 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ App Router |
| Language | TypeScript 5+ |
| Database | Prisma ORM + PostgreSQL |
| Auth | NextAuth.js v5 |
| AI | OpenAI GPT-4 API |
| UI | shadcn/ui + Tailwind CSS |
| Data Fetching | TanStack Query |
| Validation | Zod |
| Styling | Tailwind CSS + PostCSS |

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Docker
```dockerfile
# Dockerfile.prod
FROM node:20-alpine
# ... optimized production build
```

## 🤝 Contributing

1. Fork & clone
2. `npm install`
3. `npm run dev`
4. Create feature branch
5. Submit PR

## 📄 License

MIT - see [LICENSE](LICENSE) file.

---

⭐ **Star us on GitHub!** ⭐
