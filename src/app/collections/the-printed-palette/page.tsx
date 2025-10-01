import { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'The Printed Palette - Mevi Living',
  description: 'Serveware with beautiful printed patterns.',
};

export default function ThePrintedPalettePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Image
              src="https://meviliving.com/cdn/shop/collections/Your_paragraph_text_336_x_400_px_1.png?v=1740223573&width=550"
              alt="The Printed Palette Collection"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <h1 className="text-center mb-4 mt-8">The Printed Palette</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Serveware featuring beautiful floral and geometric printed patterns.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}