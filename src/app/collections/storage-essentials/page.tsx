import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Storage Essentials - Mevi Living',
  description: 'Stylish storage solutions for your home.',
};

const products = [
  {
    name: 'Grisaille Handi Pot',
    price: '₹ 1,199.00',
    image: 'https://meviliving.com/cdn/shop/files/GrisailleHandiPot_1.jpg?v=1751451479&width=533',
    href: '/products/grisaille-handi-pot',
  },
];

export default function StorageEssentialsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <h1 className="text-center mb-4">Storage Essentials</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Stylish storage solutions that blend functionality with elegance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.href} className="group">
                <Link href={product.href} className="block">
                  <div className="relative overflow-hidden rounded-lg aspect-square bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="mt-4 text-center">
                  <h3 className="font-body text-base">
                    <Link href={product.href} className="hover:text-accent transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-2 font-semibold text-price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}