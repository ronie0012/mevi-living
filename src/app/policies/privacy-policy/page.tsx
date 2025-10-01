import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Privacy Policy - Mevi Living",
  description: "Privacy Policy for Mevi Living - Learn how we protect your personal information",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="font-display text-2xl mb-4">Information We Collect</h2>
            <p className="mb-4">
              At Mevi Living, we collect information that you provide directly to us when you create an account, 
              make a purchase, sign up for our newsletter, or contact us for support.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to process your orders, communicate with you about your purchases, 
              send you marketing communications (with your consent), and improve our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Information Sharing</h2>
            <p className="mb-4">
              We do not sell or rent your personal information to third parties. We may share your information 
              with service providers who help us operate our business, such as payment processors and shipping companies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information. However, no method 
              of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Your Rights</h2>
            <p className="mb-4">
              You have the right to access, update, or delete your personal information. You may also opt out of 
              receiving marketing communications at any time by clicking the unsubscribe link in our emails.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@meviliving.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}