import { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Bloom Luxe Hampers - Mevi Living',
  description: 'Festive gift collections with decorative pieces.',
};

export default function BloomLuxeHampersPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/2_b790e481-3a04-445e-879d-5236eadcd90d-25.png?"
              alt="Bloom Luxe Hampers"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <h1 className="text-center mb-4 mt-8">Bloom Luxe Hampers</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Festive gift collections featuring decorative jars, candles, and elegant pieces.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}