import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Emerald Mug - Mevi Living",
  description: "Elegant deep green ceramic mug with luxurious finish.",
};

export default function EmeraldMugPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container">
        <div className="mb-6">
          <Link href="/collections/drinkware" className="text-text-secondary hover:text-primary text-sm">
            ← Back to Drinkware
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src="https://meviliving.com/cdn/shop/files/IMG_0652.jpg?v=1744637326&width=800"
                alt="Emerald Mug"
                width={800}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src="https://meviliving.com/cdn/shop/files/IMG_0652.jpg?v=1744637326&width=400"
                  alt="Emerald Mug - View 2"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src="https://meviliving.com/cdn/shop/files/IMG_0652.jpg?v=1744637326&width=400"
                  alt="Emerald Mug - View 3"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-h1 text-foreground mb-2">Emerald Mug</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-h3 font-semibold text-foreground">₹ 499.00</span>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-display text-h4 mb-3">Product Description</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                The Emerald Mug features a stunning deep green glaze that exudes elegance and sophistication. 
                This handcrafted ceramic mug is perfect for those who appreciate fine craftsmanship and timeless design.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Rich emerald green glaze</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Handcrafted ceramic</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Comfortable handle design</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Suitable for hot and cold beverages</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 pt-6">
              <button className="w-full bg-primary text-primary-foreground py-4 px-8 rounded-sm font-medium text-button hover:bg-primary/90 transition-colors">
                ADD TO CART
              </button>
              <button className="w-full border border-primary text-primary py-4 px-8 rounded-sm font-medium text-button hover:bg-primary hover:text-primary-foreground transition-colors">
                BUY NOW
              </button>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ethically sourced and sustainably made</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Consciously packed with care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}