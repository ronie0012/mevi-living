import Image from "next/image";

const PromotionalBanners = () => {
  return (
    <section className="bg-background">
      <div className="container py-20">
        <div className="flex flex-col items-center gap-6">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/mevi_2-29.png?"
            alt="Mevi Living brand logo with decorative elements"
            width={1500}
            height={303}
            className="w-full h-auto"
          />
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/mevi_USP_Banner-30.png?"
            alt="Mevi Living USP banner with brand promises"
            width={1500}
            height={124}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;