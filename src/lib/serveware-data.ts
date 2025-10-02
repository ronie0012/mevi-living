import { Product } from './types';

export interface ServewareProduct extends Product {
    hoverImage?: string;
    quickViewEnabled?: boolean;
    displayOrder?: number;
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

export const SERVEWARE_PRODUCTS: ServewareProduct[] = [
    {
        id: 'windsor-bloom-soiree-plates',
        slug: 'windsor-bloom-soiree-plates',
        name: 'Windsor Bloom Soiree Plates',
        description: 'Elegant ceramic plates with intricate Windsor bloom pattern, perfect for special occasions and dinner parties.',
        price: 1799,
        images: [
            '/serveware/windsor-bloom-soiree-plates.webp'
        ],
        hoverImage: '/serveware/windsor-bloom-soiree-plates.webp',
        category: 'serveware',
        stock: 25,
        inStock: false,
        features: [
            'Premium ceramic construction',
            'Windsor bloom pattern design',
            'Set of 6 plates',
            'Dishwasher safe'
        ],
        displayOrder: 1
    },
    {
        id: 'windsor-bloom-soiree-canapes',
        slug: 'windsor-bloom-soiree-canapes',
        name: 'Windsor Bloom Soiree Canapes',
        description: 'Delicate canape plates featuring the signature Windsor bloom design, ideal for appetizers and small bites.',
        price: 1799,
        images: [
            '/serveware/windsor-bloom-soiree-canapes.webp'
        ],
        hoverImage: '/serveware/windsor-bloom-soiree-canapes.webp',
        category: 'serveware',
        stock: 30,
        inStock: true,
        features: [
            'Perfect for appetizers',
            'Elegant Windsor bloom pattern',
            'Set of 6 canape plates',
            'Food-safe ceramic'
        ],
        displayOrder: 2
    },
    {
        id: 'heritage-floral-trayette',
        slug: 'heritage-floral-trayette',
        name: 'Heritage Floral Trayette',
        description: 'A beautiful heritage-inspired floral trayette that combines traditional craftsmanship with modern functionality.',
        price: 1599,
        images: [
            '/serveware/heritage-floral-trayette.webp'
        ],
        hoverImage: '/serveware/heritage-floral-trayette.webp',
        category: 'serveware',
        stock: 0,
        inStock: false,
        features: [
            'Heritage floral design',
            'Multi-purpose serving tray',
            'Durable construction',
            'Easy to clean'
        ],
        displayOrder: 3
    },
    {
        id: 'alba-trayette',
        slug: 'alba-trayette',
        name: 'Alba Trayette',
        description: 'Elegant trayette with a refined finish, perfect for serving and display.',
        price: 1599,
        images: [
            '/serveware/alba-trayette.webp'
        ],
        hoverImage: '/serveware/alba-trayette.webp',
        category: 'serveware',
        stock: 20,
        inStock: true,
        features: [
            'Refined minimalist design',
            'Multi-purpose serving tray',
            'Durable construction',
            'Easy to clean'
        ],
        displayOrder: 4
    },
    {
        id: 'ligne-bowl',
        slug: 'ligne-bowl',
        name: 'Ligne Bowl',
        description: 'Modern minimalist bowl with clean lines and contemporary design, perfect for serving salads, fruits, or decorative purposes.',
        price: 799,
        images: [
            'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=1000&fit=crop',
            createPlaceholder('Ligne Bowl', 4)
        ],
        hoverImage: createPlaceholder('Ligne Bowl Alt', 0),
        category: 'serveware',
        stock: 45,
        inStock: true,
        features: [
            'Modern minimalist design',
            'Versatile serving bowl',
            'High-quality ceramic',
            'Microwave and dishwasher safe'
        ],
        displayOrder: 4
    },
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

export const SERVEWARE_COLLECTION: CollectionMetadata = {
    id: 'serveware',
    slug: 'serveware',
    title: 'Serveware',
    description: 'Elegant serving trays, platters, and bowls crafted to elevate your dining experience.',
    seoTitle: 'Serveware Collection - Mevi Living',
    seoDescription: 'Discover our exquisite collection of serveware including elegant plates, bowls, and serving platters perfect for any occasion.',
    totalProducts: SERVEWARE_PRODUCTS.length,
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

function sortProducts(products: ServewareProduct[], sort: SortKey): ServewareProduct[] {
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

export function getServewareProducts(
  page: number = 1,
  limit: number = 8,
  sort: SortKey = 'featured'
): {
  products: ServewareProduct[];
  pagination: PaginationData;
} {
  const sorted = sortProducts(SERVEWARE_PRODUCTS, sort);
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

export function getServewareProductBySlug(slug: string): ServewareProduct | undefined {
    return SERVEWARE_PRODUCTS.find(p => p.slug === slug);
}
