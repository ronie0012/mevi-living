import React from 'react';
import { Metadata } from 'next';
import DiningCollectionClient from './DiningCollectionClient';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Dining Collection - Mevi Living',
  description: 'Discover our exquisite dining collection featuring handcrafted plates, serving dishes, and dining essentials.',
};

export default function DiningPage() {
  return (
    <main className="min-h-screen bg-background">
      <DiningCollectionClient />
      <Footer />
    </main>
  );
}
