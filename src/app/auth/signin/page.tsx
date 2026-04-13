'use client'

import { useSession } from '@/hooks/useSession'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/chat'
  const error = searchParams.get('error')
  const router = useRouter()

  const errorMessages: Record<string, string> = {
    'Callback': 'Authentication failed. Please try signing in again.',
    'CredentialsSignin': 'Invalid credentials. Please check your email and password.',
    'OAuthSignin': 'OAuth signin failed. Please try again.',
    'OAuthCallback': 'OAuth callback failed. Please try again.',
    'OAuthAccountNotLinked': 'This account is already linked to another provider. Please sign in with that provider.',
    'EmailSignin': 'Email signin failed. Please try again.',
    'AccessDenied': 'Access denied. You do not have permission to access this resource.',
    'default': 'An unexpected error occurred. Please try signing in again.',
  }

  const getErrorMessage = (err: string | null) => {
    return err && errorMessages[err] ? errorMessages[err] : errorMessages.default
  }

  const [session, loading] = useSession()
  
  useEffect(() => {
    if (session?.user?.id) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sign In
          </h1>
          <p className="text-gray-600 mt-2">Access your AI Chat sessions</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              // Clear error & redirect to Google OAuth
              const authUrl = new URL('/api/auth/google', window.location.origin)
              authUrl.searchParams.set('callbackUrl', callbackUrl!)
              window.location.href = authUrl.toString()
            }}

            className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-800 leading-relaxed">{getErrorMessage(error)}</p>
            </div>
          </div>
        )}
        
        <div className="text-xs text-center text-gray-500">
          <p>Safe and secure authentication</p>
        </div>
      </div>
    </div>
  )
}
