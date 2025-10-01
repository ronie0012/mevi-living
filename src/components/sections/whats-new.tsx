import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  name: string;
  href: string;
  image1: string;
  image2: string;
  price: string;
  originalPrice?: string;
  saleBadge?: string;
}

const products: Product[] = [
  {
    name: "Cuddle Mug",
    href: "https://meviliving.com/products/cuddle-mug",
    image1: "https://meviliving.com/cdn/shop/files/CuddleMug_1.jpg?v=1751434799&width=533",
    image2: "https://meviliving.com/cdn/shop/files/CuddleMug_2.jpg?v=1751434799&width=533",
    price: "₹ 449.00",
    originalPrice: "₹ 499.00",
    saleBadge: "10% Sale",
  },
  {
    name: "Heartlet Mug",
    href: "https://meviliving.com/products/heartlet-mug",
    image1: "https://meviliving.com/cdn/shop/files/Heartlet_Mug_4.jpg?v=1751440636&width=533",
    image2: "https://meviliving.com/cdn/shop/files/HeartletMug_2.jpg?v=1751440636&width=533",
    price: "₹ 499.00",
  },
  {
    name: "Grisaille Handi Pot",
    href: "https://meviliving.com/products/grisaille-handi-pot",
    image1: "https://meviliving.com/cdn/shop/files/GrisailleHandiPot_1.jpg?v=1751451479&width=533",
    image2: "https://meviliving.com/cdn/shop/files/GrisailleHandiPot_2.jpg?v=1751451479&width=533",
    price: "₹ 1,199.00",
  },
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden bg-white rounded-lg transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
        <Link href={product.href} className="block aspect-square">
          <div className="relative w-full h-full">
            <Image
              src={product.image1}
              alt={product.name}
              width={533}
              height={533}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
            />
            <Image
              src={product.image2}
              alt={product.name}
              width={533}
              height={533}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
            />
          </div>
        </Link>
        {product.saleBadge && (
          <div className="absolute top-3 left-3 bg-blue-gray text-white text-[10px] font-medium leading-none px-2.5 py-1.5 rounded-sm">
            {product.saleBadge.replace('% Sale', '%').replace('Sale',' SALE')}
          </div>
        )}
      </div>
      <div className="text-center mt-4 px-2">
        <h4 className="font-display text-h4 text-foreground">
          <Link href={product.href} className="hover:text-accent">
            {product.name}
          </Link>
        </h4>
        <div className="mt-2 flex justify-center items-baseline gap-2 font-body text-price">
          <span className="font-semibold text-foreground">{product.price}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground line-through font-normal text-base">
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function WhatsNew() {
  return (
    <section className="bg-background py-20">
      <div className="container">
        <h2 className="font-display text-h2 text-center text-foreground mb-12 tracking-[0.1em] uppercase">
          WHAT'S NEW
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="https://meviliving.com/collections/new"
            className="inline-block border border-primary text-primary bg-transparent text-button font-medium py-3.5 px-10 rounded-sm transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
}