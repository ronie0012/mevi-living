import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "My Account - Mevi Living",
  description: "Manage your Mevi Living account",
}

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">My Account</h1>
        
        {/* Login Required State */}
        <div className="bg-card rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-12 h-12 text-foreground/40" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl mb-4">Login Required</h2>
            <p className="text-foreground/60 mb-6">
              Please log in to view your account information and order history.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/account/login"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/account/register"
                className="inline-block border border-primary text-primary px-8 py-3 rounded hover:bg-primary/5 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}