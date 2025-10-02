import { Metadata } from 'next';
import Footer from '@/components/sections/footer';
import { CollectionHeader } from '@/components/ui/CollectionHeader';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { CollectionPagination } from '@/components/ui/CollectionPagination';
import { CollectionToolbar } from '@/components/ui/CollectionToolbar';
import { 
  getServewareProducts, 
  SERVEWARE_COLLECTION,
  SortKey
} from '@/lib/serveware-data';

export const metadata: Metadata = {
  title: 'Serveware Collection - Mevi Living',
  description: 'Elegant serving trays, platters, and bowls for your dining table.',
};

interface ServewarePageProps {
  searchParams: { page?: string; sort?: string };
}

export default function ServewarePage({ searchParams }: ServewarePageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const currentSort = (searchParams.sort as SortKey) || 'featured';
  const { products, pagination } = getServewareProducts(currentPage, 8, currentSort);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'Serveware' }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <CollectionHeader
        title={SERVEWARE_COLLECTION.title}
        description={SERVEWARE_COLLECTION.description}
        productCount={SERVEWARE_COLLECTION.totalProducts}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <CollectionToolbar totalProducts={SERVEWARE_COLLECTION.totalProducts} basePath="/collections/serveware" />

          <ProductGrid 
            products={products} 
            currentPage={currentPage}
          />
          
          <CollectionPagination
            pagination={pagination}
            basePath="/collections/serveware"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}