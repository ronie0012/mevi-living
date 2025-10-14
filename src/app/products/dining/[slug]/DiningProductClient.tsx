'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { DiningProduct, formatPrice } from '@/lib/dining-data';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { BuyNowButton } from '@/components/ui/BuyNowButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DiningProductClientProps {
  product: DiningProduct;
}

export default function DiningProductClient({ product }: DiningProductClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/collections/dining" className="hover:text-gray-900">Dining</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
          <Link 
            href="/collections/dining" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dining Collection
          </Link>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              {product.originalPrice && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="destructive" className="bg-accent">
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-accent' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-4">
                {product.name}
              </h1>
              
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl lg:text-3xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                  {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-display text-xl mb-3">Description</h2>
              <p className="text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Specifications */}
            {(product.material || product.diameter || product.setSize) && (
              <div>
                <h2 className="font-display text-xl mb-3">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.material && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Material:</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  {product.diameter && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Diameter:</span>
                      <span className="font-medium">{product.diameter}</span>
                    </div>
                  )}
                  {product.depth && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Depth:</span>
                      <span className="font-medium">{product.depth}</span>
                    </div>
                  )}
                  {product.setSize && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Set Size:</span>
                      <span className="font-medium">{product.setSize}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="font-display text-xl mb-3">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 mr-3 flex-shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Care Instructions */}
            {product.care && product.care.length > 0 && (
              <div>
                <h2 className="font-display text-xl mb-3">Care Instructions</h2>
                <ul className="space-y-2">
                  {product.care.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <AddToCartButton 
                    product={product} 
                    size="lg"
                    className="w-full rounded-sm py-4"
                    showQuantitySelector={true}
                    disabled={!product.inStock}
                  />
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-4"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="px-4"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              
              <BuyNowButton 
                product={product} 
                size="lg"
                className="w-full rounded-sm py-4"
                disabled={!product.inStock}
              />
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders above ₹999</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">30-day return policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Secure Payment</div>
                  <div className="text-sm text-gray-600">SSL encrypted checkout</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <section className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-accent py-4 px-1 text-sm font-medium text-accent">
                Product Details
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Shipping & Returns
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Size Guide
              </button>
            </nav>
          </div>
          
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-lg mb-4">Crafted with Care</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Each piece in our dining collection is carefully crafted using traditional techniques 
                  combined with modern design sensibilities. Our artisans pay attention to every detail 
                  to ensure that each plate not only serves its functional purpose but also adds beauty 
                  to your dining experience.
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg mb-4">Sustainable Materials</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We are committed to using eco-friendly materials and processes in our manufacturing. 
                  Our ceramics are sourced responsibly, and we work with suppliers who share our 
                  commitment to environmental sustainability and fair labor practices.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}