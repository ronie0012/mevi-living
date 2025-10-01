"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/Golden_Luxe_1-13.png?",
    title: "Golden Luxe",
    subtitle: "Gift Hampers",
    href: "/collections/golden-luxe-hampers",
  },
  {
    id: 2,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/Bloom_Luxe_Gift_Hampers-14.png?",
    title: "Bloom Luxe",
    subtitle: "Gift Hampers",
    href: "/collections/bloom-luxe-hampers",
  },
  {
    id: 3,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/Urli_Candles_Gift_Hampers-5.png?",
    title: "Urli Candles",
    subtitle: "Gift Hampers",
    href: "/collections/festive-urli-candles",
  },
  {
    id: 4,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/Morsel_Plates_1-9.png?",
    title: "Morsel Plates",
    subtitle: "Collection",
    href: "/collections/morsel-plates",
  },
];

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative w-full" aria-label="Hero Carousel">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[450px] md:h-[550px] lg:h-[632px]">
                <Image
                  src={slide.image}
                  alt={`${slide.title} ${slide.subtitle}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 100vw"
                />
                <div className="absolute inset-0" />
                <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-6 md:p-16 lg:p-[120px]">
                  <h2 className="font-display text-[40px] leading-[1.1] md:text-5xl lg:text-[48px] lg:leading-[1.2] drop-shadow-sm">
                    {slide.title}
                  </h2>
                  <p className="font-display text-[28px] leading-[1.1] md:text-4xl lg:text-[36px] mt-1 lg:leading-[1.3] drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                  <Button asChild className="mt-8 bg-white text-primary hover:bg-gray-200 rounded-none uppercase tracking-[0.2em] font-medium text-sm px-10 py-6 h-auto">
                    <Link href={slide.href}>Shop Now</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
            <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-none" />
            <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-none" />
        </div>
      </Carousel>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              current === index ? "bg-[#7A9CA8]" : "bg-white/60"
            }`}
             aria-label={`Go to slide ${index + 1}`}
             aria-current={current === index}
          />
        ))}
      </div>
    </section>
  );
}