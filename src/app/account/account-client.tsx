"use client"

import { useSession, signOut } from "@/lib/auth-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, LogOut } from "lucide-react"
import { OrderHistory } from "@/components/OrderHistory"

export default function AccountClient() {
  const { data: session, isPending } = useSession()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (isPending) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your account...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!session) {
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
                  href="/login"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-primary/90 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
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

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl md:text-5xl">My Account</h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="space-y-8">
          {/* Profile and Settings Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{session.user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </label>
                  <p className="text-sm">{session.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Member Since
                  </label>
                  <p className="text-sm">
                    {new Date(session.user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled>
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Email Preferences
                </Button>
                <p className="text-xs text-muted-foreground pt-2">
                  Additional settings coming soon
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order History Section */}
          <OrderHistory userId={session.user.id} email={session.user.email} />
        </div>
      </div>
    </main>
  )
}