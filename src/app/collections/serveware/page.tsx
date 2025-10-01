import { Metadata } from 'next';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Serveware Collection - Mevi Living',
  description: 'Elegant serving trays, platters, and bowls for your dining table.',
};

export default function ServewarePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <h1 className="text-center mb-4">Serveware</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Elegant serving trays, platters, and bowls crafted to elevate your dining experience.
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