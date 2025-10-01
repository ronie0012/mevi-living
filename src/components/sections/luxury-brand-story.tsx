import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const LuxuryBrandStory = () => {
  return (
    <section className="bg-background py-[70px]">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-[60px]">
          {/* Image Column */}
          <div className="w-full lg:w-[58%] order-1">
            <div className="relative overflow-hidden rounded-3xl lg:rounded-l-[200px] lg:rounded-r-none">
              <div className="aspect-square">
                 <Image
                   src="https://meviliving.com/cdn/shop/files/Untitled_design_5_951d52d5-3ae6-4fcc-9c0a-fd151ff0df5c.png?v=1739877413&width=1500"
                   alt="Elegant green ceramic tea set with gold accents"
                   width={1500}
                   height={1500}
                   className="w-full h-full object-cover"
                   loading="lazy"
                 />
              </div>
            </div>
          </div>
          
          {/* Text Column */}
          <div className="w-full lg:w-[41%] order-2 flex flex-col items-start text-left">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-text-secondary mb-4">
              Mevi living
            </p>
            <h2 className="font-display text-h2 leading-h2 text-foreground mb-6">
              EXPERIENCE THE LUXURY OF LIVING
            </h2>
            <div className="text-body-lg text-text-secondary leading-body-lg mb-8">
              <p>
                At Mevi, we're passionate about creating spaces that inspire harmony and balance. Our name, derived from Nigerian origin, means 'To prosper' – in idea that resonates deeply with our design philosophy.
              </p>
            </div>
            <Link 
              href="/pages/about-us" 
              className="font-body text-sm font-medium tracking-[0.1em] border border-primary text-primary bg-transparent py-[14px] px-7 hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              READ MORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryBrandStory;