import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "About Us - Mevi Living",
  description: "Learn about Mevi Living's story, craftsmanship, and commitment to sustainable luxury home decor",
}

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <h1 className="font-display text-4xl md:text-6xl text-center mb-6">About Mevi Living</h1>
          <p className="text-center text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Where tranquility meets style with opulence
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-6">Our Story</h2>
              <p className="text-foreground/80 mb-4 leading-relaxed">
                Mevi Living was born from a passion for creating harmony and balance in everyday living. 
                Inspired by the Nigerian word "Mevi" meaning harmony, we curate artisanal serveware and 
                drinkware that embodies elegance, sustainability, and mindful living.
              </p>
              <p className="text-foreground/80 mb-4 leading-relaxed">
                Each piece in our collection is thoughtfully crafted by skilled artisans who pour their 
                expertise and passion into every creation. We believe in the beauty of handmade products 
                and the unique character they bring to your home.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-secondary"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-secondary">
        <div className="container max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg">
              <h3 className="font-display text-2xl mb-4">Artisanal Craftsmanship</h3>
              <p className="text-foreground/70">
                Every product is handcrafted with meticulous attention to detail, ensuring that each 
                piece is unique and of the highest quality.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg">
              <h3 className="font-display text-2xl mb-4">Ethical Sourcing</h3>
              <p className="text-foreground/70">
                We partner with artisans who are fairly compensated for their work and use ethically 
                sourced materials.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg">
              <h3 className="font-display text-2xl mb-4">Sustainable Practices</h3>
              <p className="text-foreground/70">
                Our commitment to the environment is reflected in our sustainable production methods 
                and eco-friendly packaging.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg">
              <h3 className="font-display text-2xl mb-4">Conscious Design</h3>
              <p className="text-foreground/70">
                We create timeless designs that transcend trends, encouraging mindful consumption and 
                long-lasting beauty in your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16">
        <div className="container max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-6">Our Commitment</h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            At Mevi Living, we are committed to bringing you products that not only elevate your living 
            spaces but also align with your values. We believe in creating a more sustainable future 
            while celebrating the art of craftsmanship.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Thank you for choosing Mevi Living and joining us on this journey of mindful luxury living.
          </p>
        </div>
      </section>
    </main>
  )
}