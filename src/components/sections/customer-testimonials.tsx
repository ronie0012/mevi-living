import React from 'react';
import Image from 'next/image';

const testimonials = [
  {
    quote: "I love my purchase from Mevi Living! The cup is beautiful! The finish and shape are perfect! The packaging is mindful! Love the note and little touches of detail in the packaging.",
    author: "Anshu Arora",
    location: "Bangalore"
  },
  {
    quote: "I had an awesome experience with Mevi Living. They have an amazing collection of serveware, with trendy color options. The quality is also superb and extremely durable. I simply loved their collection!!",
    author: "Mayanka",
    location: "Gurgaon"
  },
  {
    quote: "I loved my purchase from Mevi Living. The cups are beautiful, such high quality and I’m in love with colour. The plates are great too, they are a great addition to my collection. And your unboxing experience was amazing, thoroughly enjoyed it",
    author: "Vasundhra Sharma",
    location: "Delhi"
  }
];

const QUOTE_ICON_URL = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/svgs/quote-1.svg?";

const CustomerTestimonials = () => {
  return (
    <section className="bg-background pt-[52.5px] pb-[60px]">
      <div className="container">
        <h2 className="font-display text-center text-foreground text-[36px] leading-[1.3] mb-[50px]">
          What customers said about us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-secondary p-10 flex flex-col rounded-lg">
              <div className="flex-grow">
                <Image
                  src={QUOTE_ICON_URL}
                  alt="Quote icon"
                  width={32}
                  height={25}
                  className="mb-5"
                />
                <p className="font-body text-foreground text-base leading-[1.6]">
                  {testimonial.quote}
                </p>
              </div>
              <p className="font-body text-text-secondary text-sm uppercase tracking-[0.04em] mt-[30px]">
                {testimonial.author}, {testimonial.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;