import { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Holiday Season Collection - Mevi Living',
  description: 'Seasonal holiday pieces to celebrate the festive spirit.',
};

export default function HolidaySeasonPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Image
              src="https://meviliving.com/cdn/shop/collections/Your_paragraph_text_1.png?v=1740223425&width=550"
              alt="Holiday Season Collection"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <h1 className="text-center mb-4 mt-8">Holiday Season</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Celebrate the holidays with our seasonal collection of mugs and decorative pieces.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}