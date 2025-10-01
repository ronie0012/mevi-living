import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Shopping Cart - Mevi Living",
  description: "View your shopping cart",
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Shopping Cart</h1>
        
        {/* Empty Cart State */}
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl mb-4">Your cart is empty</h2>
            <p className="text-foreground/60 mb-6">
              Start shopping and add items to your cart to see them here.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}