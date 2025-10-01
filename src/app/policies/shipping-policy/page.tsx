import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shipping Policy - Mevi Living",
  description: "Shipping and delivery information for Mevi Living products",
}

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Shipping Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="font-display text-2xl mb-4">Shipping Locations</h2>
            <p className="mb-4">
              We currently ship across India. International shipping is not available at this time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Processing Time</h2>
            <p className="mb-4">
              Orders are typically processed within 2-3 business days. During peak seasons or promotional periods, 
              processing may take longer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Delivery Time</h2>
            <p className="mb-4">
              Standard delivery takes 5-7 business days from the date of dispatch. Express delivery options are 
              available at checkout for faster shipping.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Shipping Charges</h2>
            <p className="mb-4">
              Shipping charges are calculated based on the weight of your order and your delivery location. 
              Free shipping is available on orders above ₹2000.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Order Tracking</h2>
            <p className="mb-4">
              Once your order is dispatched, you will receive a tracking number via email. You can track your 
              order status using this tracking number.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Delivery Issues</h2>
            <p className="mb-4">
              If you experience any issues with delivery, please contact our customer support team at 
              support@meviliving.com with your order number.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}