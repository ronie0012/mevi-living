import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Wabi Stria & Dot Mug Duo - Mevi Living",
  description: "Elegant duo set of cream-colored mugs with textured patterns.",
};

export default function WabiStraDotMugsPage() {
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
                src="https://meviliving.com/cdn/shop/files/WabiStria_DotMug_4_f372ae6c-30c0-45df-a68a-d2726bbd891b.jpg?v=1751441591&width=800"
                alt="Wabi Stria & Dot Mug Duo"
                width={800}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src="https://meviliving.com/cdn/shop/files/WabiStria_DotMug_4_f372ae6c-30c0-45df-a68a-d2726bbd891b.jpg?v=1751441591&width=400"
                  alt="Wabi Stria & Dot Mug Duo - View 2"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src="https://meviliving.com/cdn/shop/files/WabiStria_DotMug_4_f372ae6c-30c0-45df-a68a-d2726bbd891b.jpg?v=1751441591&width=400"
                  alt="Wabi Stria & Dot Mug Duo - View 3"
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
              <h1 className="font-display text-h1 text-foreground mb-2">Wabi Stria & Dot Mug Duo</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-h3 font-semibold text-foreground">₹ 799.00</span>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-display text-h4 mb-3">Product Description</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                The Wabi Stria & Dot Mug Duo features two beautifully textured ceramic mugs with distinct patterns. 
                Inspired by the Japanese philosophy of wabi-sabi, these mugs celebrate imperfection and natural beauty. 
                Perfect as a gift set or for enjoying beverages with a loved one.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Set of two unique mugs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Stria and dot textured patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Artisanal ceramic craftsmanship</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Perfect gift for couples or friends</span>
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