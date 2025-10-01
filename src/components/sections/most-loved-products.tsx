import Image from "next/image";
import Link from "next/link";
import React from "react";

const products = [
  {
    name: "Windsor Bloom Morning Bliss Mug",
    price: "₹ 599.00",
    imageUrl: "https://meviliving.com/cdn/shop/files/Photoroom_20250305_194943.jpg?v=1742870210&width=533",
    href: "/products/windsor-bloom-morning-bliss-mug",
  },
  {
    name: "Wabi StrIa & Dot Mug Duo",
    price: "₹ 799.00",
    imageUrl: "https://meviliving.com/cdn/shop/files/WabiStria_DotMug_4_f372ae6c-30c0-45df-a68a-d2726bbd891b.jpg?v=1751441591&width=533",
    href: "/products/wabi-stra-dot-mugs",
  },
  {
    name: "Emerald Mug",
    price: "₹ 499.00",
    imageUrl: "https://meviliving.com/cdn/shop/files/IMG_0652.jpg?v=1744637326&width=533",
    href: "/products/emerald-mug",
  },
];

const MostLovedProducts = () => {
  return (
    <section className="bg-background pt-[50px] pb-[70px]">
      <div className="container">
        <h2 className="font-display text-[28px] leading-[1.4] uppercase text-center text-foreground mb-[50px] tracking-[0.1em]">
          OUR MOST LOVED
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {products.map((product) => (
            <div key={product.name}>
              <Link href={product.href} className="group block">
                <div className="relative overflow-hidden rounded-lg bg-white">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={533}
                    height={533}
                    className="w-full h-auto object-cover aspect-square transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="text-center mt-4">
                <h3 className="font-body text-base text-foreground">
                  <Link
                    href={product.href}
                    className="hover:text-accent transition-colors"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1 font-body text-base text-foreground">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/collections/drinkware"
            className="inline-block border border-primary bg-transparent text-primary py-[14px] px-7 rounded-sm font-medium text-button hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MostLovedProducts;