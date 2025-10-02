"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { ServewareProduct, formatPrice } from "@/lib/serveware-data";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ServewareProduct;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const secondaryImage = product.hoverImage || product.images?.[1];
  const isSoldOut = !product.inStock;
  const [primaryError, setPrimaryError] = React.useState(false);
  const [secondaryError, setSecondaryError] = React.useState(false);

  return (
    <div className={cn("group relative", className)}>
      <div className="relative overflow-hidden bg-white">
        {/* Sold out badge */}
        {isSoldOut && (
          <div className="absolute left-3 top-3 z-20">
            <span className="bg-black text-white text-[11px] tracking-wider uppercase px-2.5 py-1 rounded-sm">Sold out</span>
          </div>
        )}

        {/* Wishlist icon */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-gray-700 shadow hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Image wrapper with hover swap */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden">
            {primaryImage && !primaryError ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-opacity duration-300"
                onError={() => setPrimaryError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Image unavailable</span>
              </div>
            )}

            {secondaryImage && !secondaryError && !primaryError && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onError={() => setSecondaryError(true)}
              />
            )}

            {/* Quick view button (center overlay) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="pointer-events-auto">
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center gap-2 bg-white/95 text-gray-900 px-4 py-2 text-sm tracking-wide uppercase rounded-sm shadow hover:bg-white"
                >
                  <Eye className="w-4 h-4" />
                  Quick view
                </Link>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Meta */}
      <div className="mt-4 text-center">
        <h3 className="font-body text-[15px] text-foreground">
          <Link href={`/products/${product.slug}`} className="hover:text-accent transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1 flex items-center justify-center gap-2 text-[15px]">
          {product.originalPrice ? (
            <>
              <span className="text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="text-foreground">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-foreground">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>

      {/* Add to cart under card for accessibility and parity with target UI */}
      <div className="mt-3">
        <AddToCartButton product={product} variant="outline" size="md" disabled={!product.inStock} />
      </div>
    </div>
  );
}