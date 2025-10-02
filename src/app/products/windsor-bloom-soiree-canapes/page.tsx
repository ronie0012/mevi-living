import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServewareProductBySlug, formatPrice } from '@/lib/serveware-data';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { BuyNowButton } from '@/components/ui/BuyNowButton';

export const metadata: Metadata = {
  title: 'Windsor Bloom Soiree Canapes - Mevi Living',
  description: 'Elegant canapes plates from the Serveware collection.',
};

export default function WindsorBloomSoireeCanapesPage() {
  const product = getServewareProductBySlug('windsor-bloom-soiree-canapes');
  if (!product) notFound();

  const mainImage = product.images[0];

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container">
        <div className="mb-6">
          <Link href="/collections/serveware" className="text-text-secondary hover:text-primary text-sm">
            ← Back to Serveware
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-white rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-display text-h1 text-foreground mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-h3 font-semibold text-foreground">{formatPrice(product.price)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-display text-h4 mb-3">Product Description</h3>
              <p className="text-text-secondary leading-relaxed mb-4">{product.description}</p>
              <ul className="space-y-2 text-text-secondary">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-6">
              <AddToCartButton product={product} size="lg" className="rounded-sm py-4" showQuantitySelector={true} />
              <BuyNowButton product={product} size="lg" className="rounded-sm py-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
