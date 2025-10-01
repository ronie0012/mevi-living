import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms of Service - Mevi Living",
  description: "Terms of Service for Mevi Living",
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="font-display text-2xl mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using Mevi Living's website and services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Use of Services</h2>
            <p className="mb-4">
              You may use our services only for lawful purposes and in accordance with these Terms. You agree not to 
              use our services in any way that could damage, disable, or impair our website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Product Information</h2>
            <p className="mb-4">
              We strive to provide accurate product information. However, as our products are handcrafted and artisanal, 
              slight variations in color, size, and design may occur.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Pricing and Payment</h2>
            <p className="mb-4">
              All prices are listed in Indian Rupees (₹) and are subject to change without notice. We reserve the 
              right to refuse or cancel any order for any reason.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Intellectual Property</h2>
            <p className="mb-4">
              All content on this website, including text, images, logos, and designs, is the property of Mevi Living 
              and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              Mevi Living shall not be liable for any indirect, incidental, special, or consequential damages arising 
              out of or in connection with your use of our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to 
              its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us at legal@meviliving.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}