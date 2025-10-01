"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate newsletter signup
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage({
        type: "success",
        text: "Thank you for subscribing! Check your email for exclusive offers.",
      });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-background pt-[60px] pb-[100px]">
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="lg:w-1/2">
            <h2 className="uppercase tracking-[0.15em]">
              Unlock Exclusive Content
            </h2>
            <p className="mt-4 leading-[1.6] text-text-secondary">
              Join our newsletter to get early access to special offers, limited
              time promotions &amp; new arrivals.
            </p>
          </div>

          <div className="w-full max-w-md lg:w-1/2">
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="flex items-center">
                <label htmlFor="newsletter-email" className="sr-only">
                  Your Email
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  disabled={isLoading}
                  className="h-14 flex-grow rounded-r-none border-r-0 bg-white px-4 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  aria-label="Subscribe"
                  className="h-14 shrink-0 rounded-l-none bg-[#7A9CA8] px-8 text-base font-medium text-white hover:bg-[#6f8c97] disabled:opacity-50"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              {message && (
                <p
                  className={`mt-3 text-sm ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;