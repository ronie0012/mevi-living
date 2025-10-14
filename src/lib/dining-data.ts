import { Product } from './types';

export interface DiningProduct extends Product {
    hoverImage?: string;
    quickViewEnabled?: boolean;
    displayOrder?: number;
    material?: string;
    diameter?: string;
    depth?: string;
    setSize?: string;
    care?: string[];
}

// Fallback placeholder function
const createPlaceholder = (text: string, variant: number = 1) => {
    const colors = [
        'f3f4f6/9ca3af', // gray
        'fef3c7/f59e0b', // amber
        'ecfdf5/10b981', // emerald
        'eff6ff/3b82f6', // blue
        'fdf2f8/ec4899', // pink
    ];
    const color = colors[variant % colors.length];
    return `https://via.placeholder.com/800x1000/${color}?text=${encodeURIComponent(text)}`;
};

export const DINING_PRODUCTS: DiningProduct[] = [
    {
        id: 'dreamspatter-quarter-plates',
        slug: 'dreamspatter-quarter-plates',
        name: 'Dreamspatter Quarter Plates',
        description: 'Elegant quarter plates featuring a dreamy spattered glaze pattern that adds artistic flair to your dining table. Perfect for appetizers, desserts, or small portion servings.',
        price: 1299,
        originalPrice: 1499,
        images: [
            '/dining/Dreamspatter Quarter Plates.webp'
        ],
        hoverImage: '/dining/Dreamspatter Quarter Plates.webp',
        category: 'dining',
        stock: 35,
        inStock: true,
        material: 'Premium Ceramic',
        diameter: '18 cm',
        depth: '2.5 cm',
        setSize: 'Set of 4',
        care: [
            'Dishwasher safe',
            'Microwave safe',
            'Avoid sudden temperature changes',
            'Hand wash recommended for longevity'
        ],
        features: [
            'Unique dreamspatter glaze finish',
            'Perfect size for appetizers and desserts',
            'Food-safe ceramic construction',
            'Elegant contemporary design',
            'Set of 4 matching plates',
            'Stackable for easy storage'
        ],
        displayOrder: 1
    },
    {
        id: 'grisaille-quarter-plates',
        slug: 'grisaille-quarter-plates',
        name: 'Grisaille Quarter Plates',
        description: 'Sophisticated quarter plates with a beautiful grisaille finish inspired by classical art techniques. These monochromatic beauties bring timeless elegance to any dining setting.',
        price: 1399,
        originalPrice: 1599,
        images: [
            '/dining/Grisaille Quarter Plates.jpg'
        ],
        hoverImage: '/dining/Grisaille Quarter Plates.jpg',
        category: 'dining',
        stock: 28,
        inStock: true,
        material: 'Fine Bone China',
        diameter: '18 cm',
        depth: '2.5 cm',
        setSize: 'Set of 4',
        care: [
            'Hand wash recommended',
            'Microwave safe',
            'Not suitable for dishwasher',
            'Handle with care'
        ],
        features: [
            'Classical grisaille art technique finish',
            'Fine bone china construction',
            'Monochromatic elegant design',
            'Perfect for formal dining',
            'Set of 4 matching plates',
            'Chip-resistant edges'
        ],
        displayOrder: 2
    },
    {
        id: 'heirloom-charm-quarter-plates',
        slug: 'heirloom-charm-quarter-plates',
        name: 'Heirloom Charm Quarter Plates',
        description: 'Charming quarter plates that evoke the warmth of family heirlooms. With their vintage-inspired design and timeless appeal, these plates bring nostalgic beauty to your table.',
        price: 1199,
        originalPrice: 1399,
        images: [
            '/dining/Heirloom Charm Quarter Plates.webp'
        ],
        hoverImage: '/dining/Heirloom Charm Quarter Plates.webp',
        category: 'dining',
        stock: 42,
        inStock: true,
        material: 'Stoneware Ceramic',
        diameter: '18 cm',
        depth: '2.5 cm',
        setSize: 'Set of 4',
        care: [
            'Dishwasher safe',
            'Microwave safe',
            'Oven safe up to 200°C',
            'Freezer safe'
        ],
        features: [
            'Vintage-inspired heirloom design',
            'Durable stoneware construction',
            'Versatile for all occasions',
            'Family-friendly dining',
            'Set of 4 matching plates',
            'Multi-temperature safe'
        ],
        displayOrder: 3
    },
    {
        id: 'opal-blush-quarter-plates',
        slug: 'opal-blush-quarter-plates',
        name: 'Opal Blush Quarter Plates',
        description: 'Delicate quarter plates featuring a soft opal blush finish that catches light beautifully. These plates add a touch of romance and sophistication to your dining experience.',
        price: 1349,
        originalPrice: 1549,
        images: [
            '/dining/Opal Blush Quarter Plates.webp'
        ],
        hoverImage: '/dining/Opal Blush Quarter Plates.webp',
        category: 'dining',
        stock: 31,
        inStock: true,
        material: 'Porcelain',
        diameter: '18 cm',
        depth: '2.5 cm',
        setSize: 'Set of 4',
        care: [
            'Hand wash recommended',
            'Microwave safe',
            'Avoid abrasive cleaners',
            'Store carefully to prevent chipping'
        ],
        features: [
            'Romantic opal blush finish',
            'Light-catching iridescent quality',
            'Premium porcelain construction',
            'Perfect for special occasions',
            'Set of 4 matching plates',
            'Elegant table presentation'
        ],
        displayOrder: 4
    },
    {
        id: 'sierra-pasta-serving-plate',
        slug: 'sierra-pasta-serving-plate',
        name: 'Sierra Pasta Serving Plate',
        description: 'A generous pasta serving plate inspired by the rugged beauty of mountain ranges. Perfect for family-style pasta dishes, salads, or as a stunning centerpiece platter.',
        price: 1899,
        originalPrice: 2199,
        images: [
            '/dining/Sierra Pasta Serving Plate.webp'
        ],
        hoverImage: '/dining/Sierra Pasta Serving Plate.webp',
        category: 'dining',
        stock: 18,
        inStock: true,
        material: 'Rustic Ceramic',
        diameter: '32 cm',
        depth: '5 cm',
        setSize: 'Individual Piece',
        care: [
            'Dishwasher safe',
            'Microwave safe',
            'Oven safe up to 220°C',
            'Cool gradually after heating'
        ],
        features: [
            'Large family-style serving size',
            'Mountain-inspired sierra design',
            'Perfect for pasta and salads',
            'Rustic ceramic construction',
            'Statement centerpiece potential',
            'High-temperature resistant'
        ],
        displayOrder: 5
    },
    {
        id: 'sirocco-glazed-quarter-plates',
        slug: 'sirocco-glazed-quarter-plates',
        name: 'Sirocco Glazed Quarter Plates',
        description: 'Quarter plates with a distinctive sirocco-inspired glaze that captures the essence of desert winds. The unique finish brings warmth and character to your dining table.',
        price: 1249,
        originalPrice: 1449,
        images: [
            '/dining/Sirocco Glazed Quarter Plates.webp'
        ],
        hoverImage: '/dining/Sirocco Glazed Quarter Plates.webp',
        category: 'dining',
        stock: 38,
        inStock: true,
        material: 'Glazed Ceramic',
        diameter: '18 cm',
        depth: '2.5 cm',
        setSize: 'Set of 4',
        care: [
            'Dishwasher safe',
            'Microwave safe',
            'Avoid extreme temperature changes',
            'Use soft cloth for cleaning'
        ],
        features: [
            'Desert wind-inspired sirocco glaze',
            'Unique textured finish',
            'Warm earthy tones',
            'Contemporary artistic design',
            'Set of 4 matching plates',
            'Conversation starter pieces'
        ],
        displayOrder: 6
    }
];

export interface CollectionMetadata {
    id: string;
    slug: string;
    title: string;
    description: string;
    seoTitle?: string;
    seoDescription?: string;
    totalProducts: number;
    productsPerPage: number;
}

export const DINING_COLLECTION: CollectionMetadata = {
    id: 'dining',
    slug: 'dining',
    title: 'Dining Collection',
    description: 'Elegant dining plates and serveware crafted to elevate every meal into a memorable experience.',
    seoTitle: 'Dining Collection - Artisan Plates & Serveware | Mevi Living',
    seoDescription: 'Discover our exquisite dining collection featuring handcrafted plates, serving dishes, and dining essentials. Perfect for everyday meals and special occasions.',
    totalProducts: DINING_PRODUCTS.length,
    productsPerPage: 8
};

export interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    productsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export type SortKey =
  | 'featured'
  | 'best-selling'
  | 'alpha-asc'
  | 'alpha-desc'
  | 'price-asc'
  | 'price-desc'
  | 'date-asc'
  | 'date-desc';

function sortProducts(products: DiningProduct[], sort: SortKey): DiningProduct[] {
  const arr = [...products];
  switch (sort) {
    case 'alpha-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'alpha-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'date-asc':
      // Using displayOrder as a proxy for date old->new
      return arr.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    case 'date-desc':
      // Using displayOrder as a proxy for date new->old
      return arr.sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
    case 'best-selling':
    case 'featured':
    default:
      // Default to curated featured order by displayOrder
      return arr.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }
}

export function getDiningProducts(
  page: number = 1,
  limit: number = 8,
  sort: SortKey = 'featured'
): {
  products: DiningProduct[];
  pagination: PaginationData;
} {
  const sorted = sortProducts(DINING_PRODUCTS, sort);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const products = sorted.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sorted.length / limit);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts: sorted.length,
      productsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function formatPrice(price: number): string {
    return `₹ ${price.toLocaleString('en-IN')}.00`;
}

export function getDiningProductBySlug(slug: string): DiningProduct | undefined {
    return DINING_PRODUCTS.find(p => p.slug === slug);
}

// Filter functions
export function getDiningProductsByMaterial(material: string): DiningProduct[] {
    return DINING_PRODUCTS.filter(p => p.material?.toLowerCase().includes(material.toLowerCase()));
}

export function getDiningProductsInPriceRange(minPrice: number, maxPrice: number): DiningProduct[] {
    return DINING_PRODUCTS.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

export function getAvailableMaterials(): string[] {
    const materials = DINING_PRODUCTS
        .map(p => p.material)
        .filter(Boolean) as string[];
    return [...new Set(materials)];
}

export function getPriceRange(): { min: number; max: number } {
    const prices = DINING_PRODUCTS.map(p => p.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}