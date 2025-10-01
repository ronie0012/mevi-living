"use client";

import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function AccountPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=" + encodeURIComponent("/account"));
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  if (isPending) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="container max-w-5xl">
          <div className="bg-card rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-foreground/60">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">My Account</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <div className="bg-card rounded-lg p-8">
            <h2 className="font-display text-2xl mb-6">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground/60">Name</label>
                <p className="text-lg font-medium">{session.user.name}</p>
              </div>
              <div>
                <label className="text-sm text-foreground/60">Email</label>
                <p className="text-lg font-medium">{session.user.email}</p>
              </div>
              <div>
                <label className="text-sm text-foreground/60">Member Since</label>
                <p className="text-lg font-medium">
                  {new Date(session.user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg p-8">
            <h2 className="font-display text-2xl mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                href="/cart"
                className="block w-full bg-secondary text-foreground px-6 py-3 rounded hover:bg-secondary/80 transition-colors text-center"
              >
                View Cart
              </Link>
              <Link
                href="/collections"
                className="block w-full bg-secondary text-foreground px-6 py-3 rounded hover:bg-secondary/80 transition-colors text-center"
              >
                Browse Collections
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full border border-destructive text-destructive px-6 py-3 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Order History Placeholder */}
          <div className="bg-card rounded-lg p-8 md:col-span-2">
            <h2 className="font-display text-2xl mb-6">Order History</h2>
            <div className="text-center py-8">
              <p className="text-foreground/60">You haven't placed any orders yet.</p>
              <Link
                href="/collections"
                className="inline-block mt-4 bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-primary/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}