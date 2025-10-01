import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Drinkware Collection - Mevi Living',
  description: 'Artisanal mugs, cups, and drinkware handcrafted with care.',
};

const products = [
  {
    name: 'Cuddle Mug',
    price: '₹ 449.00',
    originalPrice: '₹ 499.00',
    image: 'https://meviliving.com/cdn/shop/files/CuddleMug_1.jpg?v=1751434799&width=533',
    href: '/products/cuddle-mug',
    badge: '10% Sale'
  },
  {
    name: 'Heartlet Mug',
    price: '₹ 499.00',
    image: 'https://meviliving.com/cdn/shop/files/Heartlet_Mug_4.jpg?v=1751440636&width=533',
    href: '/products/heartlet-mug',
  },
  {
    name: 'Emerald Mug',
    price: '₹ 499.00',
    image: 'https://meviliving.com/cdn/shop/files/IMG_0652.jpg?v=1744637326&width=533',
    href: '/products/emerald-mug',
  },
  {
    name: 'Windsor Bloom Morning Bliss Mug',
    price: '₹ 599.00',
    image: 'https://meviliving.com/cdn/shop/files/Photoroom_20250305_194943.jpg?v=1742870210&width=533',
    href: '/products/windsor-bloom-morning-bliss-mug',
  },
  {
    name: 'Wabi StrIa & Dot Mug Duo',
    price: '₹ 799.00',
    image: 'https://meviliving.com/cdn/shop/files/WabiStria_DotMug_4_f372ae6c-30c0-45df-a68a-d2726bbd891b.jpg?v=1751441591&width=533',
    href: '/products/wabi-stra-dot-mugs',
  },
];

export default function DrinkwarePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <h1 className="text-center mb-4">Drinkware</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Artisanal mugs, cups, and drinkware handcrafted with care.
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
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-blue-gray text-white text-xs font-medium px-3 py-1.5 rounded-sm">
                        {product.badge}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="mt-4 text-center">
                  <h3 className="font-body text-base">
                    <Link href={product.href} className="hover:text-accent transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="mt-2 flex justify-center items-baseline gap-2">
                    <span className="font-semibold text-price">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
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