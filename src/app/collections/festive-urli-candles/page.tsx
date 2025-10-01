import { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Festive Urli Candles - Mevi Living',
  description: 'Decorative urli candles for festive celebrations.',
};

export default function FestiveUrliCandlesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/4_0e0008a6-c386-4cbd-b98e-86b930258cc0-26.png?"
              alt="Festive Urli Candles"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <h1 className="text-center mb-4 mt-8">Festive Urli Candles</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Beautiful decorative urli candles with floral designs, perfect for festive occasions.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}