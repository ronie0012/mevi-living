'use client';

import { ProductCard } from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ServewareProduct } from '@/lib/serveware-data';

interface ProductGridProps {
  products: ServewareProduct[];
  currentPage?: number;
}

export function ProductGrid({ products, currentPage = 1 }: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div 
        id="product-grid"
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            We couldn't find any products in this collection. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="product-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
    >
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          priority={currentPage === 1 && index < 4} // Prioritize first 4 images on first page
        />
      ))}
    </div>
  );
}