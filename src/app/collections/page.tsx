import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Our Collections - Mevi Living',
  description: 'Explore our curated collections of luxury home decor and artisanal serveware.',
};

const collections = [
  {
    name: 'Drinkware',
    href: '/collections/drinkware',
    image: 'https://meviliving.com/cdn/shop/files/IMG_0652.jpg?v=1744637326&width=533',
    description: 'Artisanal mugs, cups, and drinkware'
  },
  {
    name: 'Serveware',
    href: '/collections/serveware',
    image: 'https://meviliving.com/cdn/shop/files/WabiStria_DotMug_4_f372ae6c-30c0-45df-a68a-d2726bbd891b.jpg?v=1751441591&width=533',
    description: 'Elegant serving trays and platters'
  },
  {
    name: 'Dining',
    href: '/collections/dining',
    image: 'https://meviliving.com/cdn/shop/files/Photoroom_20250305_194943.jpg?v=1742870210&width=533',
    description: 'Beautiful dining essentials'
  },
  {
    name: 'Storage Essentials',
    href: '/collections/storage-essentials',
    image: 'https://meviliving.com/cdn/shop/files/GrisailleHandiPot_1.jpg?v=1751451479&width=533',
    description: 'Stylish storage solutions'
  },
  {
    name: 'Golden Luxe Hampers',
    href: '/collections/golden-luxe-hampers',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/1_f92911b6-e3f3-4958-a098-87e9647aa699-24.png?',
    description: 'Luxury gift hampers'
  },
  {
    name: 'Bloom Luxe Hampers',
    href: '/collections/bloom-luxe-hampers',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/2_b790e481-3a04-445e-879d-5236eadcd90d-25.png?',
    description: 'Festive gift collections'
  },
  {
    name: 'Festive Urli Candles',
    href: '/collections/festive-urli-candles',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/4_0e0008a6-c386-4cbd-b98e-86b930258cc0-26.png?',
    description: 'Decorative urli candles'
  },
  {
    name: 'Holiday Season',
    href: '/collections/holiday-season',
    image: 'https://meviliving.com/cdn/shop/collections/Your_paragraph_text_1.png?v=1740223425&width=550',
    description: 'Seasonal holiday collection'
  },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container">
          <h1 className="text-center mb-4">Our Collections</h1>
          <p className="text-center text-text-secondary text-body-lg max-w-2xl mx-auto mb-16">
            Discover our thoughtfully curated collections of luxury home decor and artisanal serveware.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.href}
                href={collection.href}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg aspect-square bg-white">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-display text-h4 text-center">{collection.name}</h3>
                <p className="mt-2 text-center text-text-secondary text-body-sm">{collection.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}