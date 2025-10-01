import Image from 'next/image';

const BrandIntroduction = () => {
  return (
    <section className="bg-background py-20">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-[50px] h-[55px] mb-8">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/image_17-23.png?"
              alt="Mevi Living house icon"
              fill
              sizes="50px"
              className="object-contain"
            />
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/image_16-22.png?"
              alt="Mevi Living leaf icon"
              fill
              sizes="50px"
              className="object-contain"
            />
          </div>

          <p className="font-display text-[22px] text-text-secondary leading-[1.4] max-w-3xl mb-8">
            This festive season, Mevi Living brings you thoughtfully curated gifts in artisanal
            <br />
            serveware and drinkware, crafted to celebrate harmony and style.
          </p>

          <p className="font-body text-base text-text-secondary leading-normal max-w-4xl">
            Welcome to Mevi Living, where tranquillity meets style with a touch of opulence. We believe every home should be a sanctuary that fosters harmony &amp; good fortune. Our designs are thoughtfully curated to blend in a streak of calm &amp; create a haven for our everyday lives that begets prosperity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandIntroduction;