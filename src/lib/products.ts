import { Product } from './types';

export const PRODUCTS: Record<string, Product> = {
  'cuddle-mug': {
    id: 'cuddle-mug',
    slug: 'cuddle-mug',
    name: 'Cuddle Mug',
    description: 'The Cuddle Mug features a charming heart pattern design that brings warmth and comfort to your daily coffee or tea ritual. Crafted from high-quality ceramic, this mug is both beautiful and functional.',
    price: 449,
    originalPrice: 499,
    images: [
      'https://meviliving.com/cdn/shop/files/CuddleMug_1.jpg?v=1751434799&width=800',
      'https://meviliving.com/cdn/shop/files/CuddleMug_2.jpg?v=1751434799&width=400'
    ],
    category: 'drinkware',
    stock: 50,
    inStock: true,
    isOnSale: true,
    salePercentage: 10,
    features: [
      'Premium ceramic construction',
      'Heart pattern design',
      'Perfect for hot beverages',
      'Dishwasher and microwave safe'
    ]
  },
  'emerald-mug': {
    id: 'emerald-mug',
    slug: 'emerald-mug',
    name: 'Emerald Mug',
    description: 'The Emerald Mug features a stunning deep green glaze that exudes elegance and sophistication. This handcrafted ceramic mug is perfect for those who appreciate fine craftsmanship and timeless design.',
    price: 499,
    images: [
      'https://meviliving.com/cdn/shop/files/IMG_0652.jpg?v=1744637326&width=800'
    ],
    category: 'drinkware',
    stock: 35,
    inStock: true,
    features: [
      'Rich emerald green glaze',
      'Handcrafted ceramic',
      'Comfortable handle design',
      'Suitable for hot and cold beverages'
    ]
  },
  'heartlet-mug': {
    id: 'heartlet-mug',
    slug: 'heartlet-mug',
    name: 'Heartlet Mug',
    description: 'The Heartlet Mug is a beautifully crafted heart-shaped ceramic mug that adds a touch of love to your beverage experience. Its unique design makes it a perfect gift for special occasions or a delightful addition to your own collection.',
    price: 499,
    images: [
      'https://meviliving.com/cdn/shop/files/Heartlet_Mug_4.jpg?v=1751440636&width=800',
      'https://meviliving.com/cdn/shop/files/HeartletMug_2.jpg?v=1751440636&width=400'
    ],
    category: 'drinkware',
    stock: 28,
    inStock: true,
    features: [
      'Heart-shaped unique design',
      'Premium ceramic material',
      'Perfect gift for loved ones',
      'Easy to clean and maintain'
    ]
  },
  'wabi-stra-dot-mugs': {
    id: 'wabi-stra-dot-mugs',
    slug: 'wabi-stra-dot-mugs',
    name: 'Wabi Stria & Dot Mug Duo',
    description: 'The Wabi Stria & Dot Mug Duo features two beautifully textured ceramic mugs with distinct patterns. Inspired by the Japanese philosophy of wabi-sabi, these mugs celebrate imperfection and natural beauty. Perfect as a gift set or for enjoying beverages with a loved one.',
    price: 799,
    images: [
      'https://meviliving.com/cdn/shop/files/WabiStria_DotMug_4_f372ae6c-30c0-45df-a68a-d2726bbd891b.jpg?v=1751441591&width=800'
    ],
    category: 'drinkware',
    stock: 20,
    inStock: true,
    features: [
      'Set of two unique mugs',
      'Stria and dot textured patterns',
      'Artisanal ceramic craftsmanship',
      'Perfect gift for couples or friends'
    ]
  },
  'windsor-bloom-morning-bliss-mug': {
    id: 'windsor-bloom-morning-bliss-mug',
    slug: 'windsor-bloom-morning-bliss-mug',
    name: 'Windsor Bloom Morning Bliss Mug',
    description: 'The Windsor Bloom Morning Bliss Mug features an intricate floral pattern that brings elegance to your morning routine. Each mug is carefully crafted with attention to detail, making it a beautiful addition to your serveware collection.',
    price: 599,
    images: [
      'https://meviliving.com/cdn/shop/files/Photoroom_20250305_194943.jpg?v=1742870210&width=800'
    ],
    category: 'drinkware',
    stock: 42,
    inStock: true,
    features: [
      'Delicate floral pattern design',
      'High-quality ceramic construction',
      'Perfect for morning coffee or tea',
      'Dishwasher safe'
    ]
  },
  'grisaille-handi-pot': {
    id: 'grisaille-handi-pot',
    slug: 'grisaille-handi-pot',
    name: 'Grisaille Handi Pot',
    description: 'The Grisaille Handi Pot is a beautifully crafted ceramic pot with a lid, perfect for serving traditional dishes or storing dry goods. Its elegant grisaille finish adds a touch of sophistication to any table setting or kitchen storage.',
    price: 1199,
    images: [
      'https://meviliving.com/cdn/shop/files/GrisailleHandiPot_1.jpg?v=1751451479&width=800',
      'https://meviliving.com/cdn/shop/files/GrisailleHandiPot_2.jpg?v=1751451479&width=400'
    ],
    category: 'storage-essentials',
    stock: 15,
    inStock: true,
    features: [
      'Premium ceramic with lid',
      'Elegant grisaille finish',
      'Multi-purpose use (serving & storage)',
      'Durable and easy to clean'
    ]
  }
};

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS[slug];
}

export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS);
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter(product => product.category === category);
}

export function formatPrice(price: number): string {
  return `₹ ${price.toLocaleString('en-IN')}.00`;
}