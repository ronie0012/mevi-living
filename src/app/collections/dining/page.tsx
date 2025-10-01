import { Metadata } from 'next';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Dining Collection - Mevi Living',
  description: 'Beautiful dining essentials for mindful living.',
};

export default function DiningPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <h1 className="text-center mb-4">Dining</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Beautiful dining essentials to create memorable moments around the table.
          </p>
          
          <div className="text-center text-text-muted">
            <p>Collection coming soon</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}