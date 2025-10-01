"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: number;
  type: 'image' | 'video';
}

const galleryItems: GalleryItem[] = [
  { id: 1, type: "video" },
  { id: 2, type: "image"},
  { id: 3, type: "video"},
  { id: 4, type: "image"},
  { id: 5, type: "video"},
  { id: 6, type: "image"},
  { id: 7, type: "video"},
  { id: 8, type: "image"},
  { id: 9, type: "video"},
  { id: 10, type: "image"},
  { id: 11, type: "video"},
  { id: 12, type: "image"},
  { id: 13, type: "video"},
  { id: 14, type: "image"},
  { id: 15, type: "video"},
  { id: 16, type: "image"},
];

const InstagramGallery = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const checkScrollPosition = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const atStart = el.scrollLeft <= 0;
            const atEnd = el.scrollWidth - el.scrollLeft - el.clientWidth <= 1;
            setIsAtStart(atStart);
            setIsAtEnd(atEnd);
        }
    }, []);
    
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            checkScrollPosition();
            el.addEventListener("scroll", checkScrollPosition, { passive: true });
            window.addEventListener("resize", checkScrollPosition);

            return () => {
                el.removeEventListener("scroll", checkScrollPosition);
                window.removeEventListener("resize", checkScrollPosition);
            };
        }
    }, [checkScrollPosition]);

    const handleScroll = (direction: "prev" | "next"): void => {
        const el = scrollContainerRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * 0.8;
            el.scrollBy({
                left: direction === "next" ? scrollAmount : -scrollAmount,
                behavior: "smooth",
            });
        }
    };
    
    return (
        <section className="bg-background py-20">
            <div className="container">
                <h2 className="text-center font-display text-[22px] font-normal uppercase tracking-[2.2px] text-foreground mb-[50px]">
                    MEVI ON INSTAGRAM
                </h2>
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-3 px-3 pb-4 gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {galleryItems.map((item, index) => (
                            <a 
                                key={item.id}
                                href="https://www.instagram.com/meviliving/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="snap-start flex-shrink-0 relative group overflow-hidden w-[75vw] md:w-[38vw] lg:w-[282px] aspect-square block"
                            >
                                <Image
                                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/icons/placeholder-2.png?"
                                    alt={`Instagram post ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 75vw, (max-width: 1024px) 38vw, 282px"
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                                {item.type === "video" && (
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                     <Image
                                         src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/icons/video-icon-v3-1.png?"
                                         alt="Play video"
                                         width={50}
                                         height={50}
                                         className="w-[50px] h-[50px] transition-transform duration-300 group-hover:scale-110"
                                     />
                                </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors duration-300"></div>
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <button
                            onClick={() => handleScroll("prev")}
                            disabled={isAtStart}
                            aria-label="Previous post"
                            className="absolute top-1/2 -translate-y-1/2 -left-5 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg"
                        >
                            <ChevronLeft className="w-6 h-6 text-foreground" />
                        </button>
                        <button
                            onClick={() => handleScroll("next")}
                            disabled={isAtEnd}
                            aria-label="Next post"
                            className="absolute top-1/2 -translate-y-1/2 -right-5 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg"
                        >
                            <ChevronRight className="w-6 h-6 text-foreground" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InstagramGallery;