import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cuddle Mug - Mevi Living",
  description: "Beautiful heart-patterned ceramic mug. Perfect for your morning coffee or tea.",
};

export default function CuddleMugPage() {
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
                src="https://meviliving.com/cdn/shop/files/CuddleMug_1.jpg?v=1751434799&width=800"
                alt="Cuddle Mug - Front View"
                width={800}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src="https://meviliving.com/cdn/shop/files/CuddleMug_2.jpg?v=1751434799&width=400"
                  alt="Cuddle Mug - Side View"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src="https://meviliving.com/cdn/shop/files/CuddleMug_1.jpg?v=1751434799&width=400"
                  alt="Cuddle Mug - Detail"
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
              <div className="inline-block bg-blue-gray text-white text-xs font-medium px-3 py-1.5 rounded-sm mb-3">
                10% SALE
              </div>
              <h1 className="font-display text-h1 text-foreground mb-2">Cuddle Mug</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-h3 font-semibold text-foreground">₹ 449.00</span>
                <span className="text-xl text-muted-foreground line-through">₹ 499.00</span>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-display text-h4 mb-3">Product Description</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                The Cuddle Mug features a charming heart pattern design that brings warmth and comfort to your daily coffee or tea ritual. 
                Crafted from high-quality ceramic, this mug is both beautiful and functional.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Premium ceramic construction</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Heart pattern design</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Perfect for hot beverages</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Dishwasher and microwave safe</span>
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