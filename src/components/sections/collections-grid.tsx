import Image from "next/image";
import Link from "next/link";

interface CollectionItem {
  name: string;
  href: string;
  imageSrc: string;
  alt: string;
}

const collectionsData: CollectionItem[] = [
  {
    name: "HOLIDAY SEASON",
    href: "/collections/holiday-season",
    imageSrc: "https://meviliving.com/cdn/shop/collections/Your_paragraph_text_1.png?v=1740223425&width=550",
    alt: "A blue ceramic mug placed on a wooden surface with holiday decorations in the background.",
  },
  {
    name: "THE PRINTED PALETTE",
    href: "/collections/the-printed-palette",
    imageSrc: "https://meviliving.com/cdn/shop/collections/Your_paragraph_text_336_x_400_px_1.png?v=1740223573&width=550",
    alt: "A set of serveware with a floral printed pattern, including a rectangular tray and two small bowls.",
  },
  {
    name: "THE HOSTING EDIT",
    href: "/collections/the-hosting-edit",
    imageSrc: "https://meviliving.com/cdn/shop/collections/Snapinsta.app_463105645_1633141640579221_2680304535585376555_n_1080.jpg?v=1740223395&width=550",
    alt: "A set of black, rectangular serving trays arranged on a wooden table.",
  },
];

const CollectionsGrid = () => {
  return (
    <section className="bg-background py-20">
      <div className="container">
        <h2 className="text-center uppercase tracking-[0.2em] mb-12">
          OUR COLLECTIONS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collectionsData.map((collection) => (
            <Link
              href={collection.href}
              key={collection.name}
              className="group block"
            >
              <div className="overflow-hidden aspect-square bg-secondary">
                <Image
                  src={collection.imageSrc}
                  alt={collection.alt}
                  width={550}
                  height={550}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <h3 className="mt-6 text-center font-body text-sm uppercase tracking-wider text-foreground font-normal">
                {collection.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsGrid;