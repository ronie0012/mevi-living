import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    name: "GOLDEN LUXE HAMPERS",
    href: "/collections/golden-luxe-hampers",
    imageSrc:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/1_f92911b6-e3f3-4958-a098-87e9647aa699-24.png?",
    alt: "Golden Luxe Hampers",
  },
  {
    name: "BLOOM LUXE HAMPERS",
    href: "/collections/bloom-luxe-hampers",
    imageSrc:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/2_b790e481-3a04-445e-879d-5236eadcd90d-25.png?",
    alt: "Bloom Luxe Hampers",
  },
  {
    name: "FESTIVE URLIS",
    href: "/collections/festive-urli-candles",
    imageSrc:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/4_0e0008a6-c386-4cbd-b98e-86b930258cc0-26.png?",
    alt: "Festive Urli Candles",
  },
];

const GiftCollectionsShowcase = () => {
  return (
    <section className="bg-background py-20">
      <div className="container">
        <h2 className="font-display text-h2 text-foreground text-center tracking-[0.2em] mb-16 uppercase">
          GIFT THOUGHTFULLY. HOST BEAUTIFULLY
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <li key={collection.name}>
              <Link href={collection.href} className="group block text-center">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={collection.imageSrc}
                    alt={collection.alt}
                    width={380}
                    height={380}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-[0.85]"
                  />
                </div>
                <p className="mt-6 font-body text-base uppercase tracking-[0.1em] text-foreground group-hover:underline group-hover:underline-offset-4">
                  {collection.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default GiftCollectionsShowcase;