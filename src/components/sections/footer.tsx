import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

const navLinks = [
  { href: '/collections/drinkware', label: 'Drinkware' },
  { href: '/collections/serveware', label: 'Serveware' },
  { href: '/collections/dining', label: 'Dining' },
  { href: '/collections/storage-essentials', label: 'Storage Essentials' },
  { href: '/collections', label: 'Our Collection' },
  { href: '/pages/about-us', label: 'About Us' },
];

const policyLinks = [
  { href: '/policies/privacy-policy', label: 'Privacy Policy' },
  { href: '/policies/shipping-policy', label: 'Shipping Policy' },
  { href: '/policies/refund-policy', label: 'Return & Exchange Policy' },
  { href: '/policies/terms-of-service', label: 'Terms of Services' },
  { href: '#', label: 'Your privacy choices' },
];

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground font-body">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 pt-20 pb-16">
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/mevi_png_2-1.png?"
                alt="Mevi Living logo"
                width={110}
                height={38}
                className="h-auto"
              />
            </Link>
            <p className="text-sm text-text-secondary leading-[1.6]">
              Mevi is a luxury lifestyle brand that embodies the perfect blend of elegance, sophistication, and sustainability. We're passionate about curating exquisite, handmade pieces that elevate your space and inspire a more mindful way of living. Our collections are thoughtfully curated to bring a sense of calm and refinement to your everyday life. By partnering with skilled artisans locally and globally, we support the preservation of traditional craftsmanship and foster a community of creatives.
            </p>
          </div>
          
          <div>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">(Mon-Sat 10am-7pm)</p>
            <a href="mailto:meviliving@gmail.com" className="block text-sm text-text-secondary hover:text-foreground transition-colors">
              meviliving@gmail.com
            </a>
            <div className="flex items-center space-x-4 pt-3">
              <a href="https://www.facebook.com/share/18u25nW6Gk/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-text-secondary hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/meviliving/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-secondary hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <p className="text-center text-xs text-text-muted">
            © 2025, Mevi Living - Design & Developed by <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Why Not Social</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;