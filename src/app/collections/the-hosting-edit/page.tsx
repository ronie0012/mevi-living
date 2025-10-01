import { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'The Hosting Edit - Mevi Living',
  description: 'Curated pieces for elegant hosting.',
};

export default function TheHostingEditPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Image
              src="https://meviliving.com/cdn/shop/collections/Snapinsta.app_463105645_1633141640579221_2680304535585376555_n_1080.jpg?v=1740223395&width=550"
              alt="The Hosting Edit Collection"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <h1 className="text-center mb-4 mt-8">The Hosting Edit</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Elegant serving trays and platters perfect for hosting with style.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}