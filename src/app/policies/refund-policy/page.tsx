import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Return & Exchange Policy - Mevi Living",
  description: "Return and exchange policy for Mevi Living products",
}

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Return & Exchange Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="font-display text-2xl mb-4">Return Window</h2>
            <p className="mb-4">
              We accept returns within 7 days of delivery. To be eligible for a return, items must be unused, 
              in their original condition, and in the original packaging.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Non-Returnable Items</h2>
            <p className="mb-4">
              Due to the artisanal nature of our products, certain items cannot be returned once opened. 
              This includes gift hampers, candles (if used), and personalized items.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Exchange Process</h2>
            <p className="mb-4">
              To initiate an exchange, please contact our customer service team at support@meviliving.com with 
              your order number and photos of the item. We will provide instructions for returning the item.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Refund Processing</h2>
            <p className="mb-4">
              Once we receive and inspect your return, we will process your refund within 7-10 business days. 
              The refund will be credited to your original payment method.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Damaged or Defective Items</h2>
            <p className="mb-4">
              If you receive a damaged or defective item, please contact us immediately with photos. We will 
              arrange for a replacement or full refund at no additional cost to you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Return Shipping</h2>
            <p className="mb-4">
              Return shipping costs are the responsibility of the customer unless the return is due to our error 
              or a defective product.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}