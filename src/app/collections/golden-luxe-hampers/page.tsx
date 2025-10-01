import { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Golden Luxe Hampers - Mevi Living',
  description: 'Luxury gift hampers with artisanal serveware and drinkware.',
};

export default function GoldenLuxeHampersPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/1_f92911b6-e3f3-4958-a098-87e9647aa699-24.png?"
              alt="Golden Luxe Hampers"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <h1 className="text-center mb-4 mt-8">Golden Luxe Hampers</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Thoughtfully curated luxury gift hampers featuring our finest artisanal serveware and drinkware.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}