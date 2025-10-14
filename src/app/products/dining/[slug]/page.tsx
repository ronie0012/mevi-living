import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDiningProductBySlug } from '@/lib/dining-data';
import DiningProductClient from './DiningProductClient';

interface DiningProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DiningProductPageProps): Promise<Metadata> {
  const product = getDiningProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found - Mevi Living',
      description: 'The product you are looking for could not be found.',
    };
  }

  return {
    title: `${product.name} - Dining Collection | Mevi Living`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map(img => ({
        url: img,
        width: 800,
        height: 600,
        alt: product.name,
      })),
    },
  };
}

export default function DiningProductPage({ params }: DiningProductPageProps) {
  const product = getDiningProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  return <DiningProductClient product={product} />;
}
