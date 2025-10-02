'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationData } from '@/lib/serveware-data';

interface CollectionPaginationProps {
  pagination: PaginationData;
  basePath: string;
}

export function CollectionPagination({ 
  pagination, 
  basePath
}: CollectionPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { currentPage, totalPages, hasPreviousPage, hasNextPage } = pagination;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    
    const url = createPageUrl(page);
    router.push(url);
    
    // Scroll to top of product grid
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-12">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href={hasPreviousPage ? createPageUrl(currentPage - 1) : '#'}
              onClick={(e) => {
                e.preventDefault();
                if (hasPreviousPage) {
                  handlePageChange(currentPage - 1);
                }
              }}
              className={!hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageUrl(page)}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href={hasNextPage ? createPageUrl(currentPage + 1) : '#'}
              onClick={(e) => {
                e.preventDefault();
                if (hasNextPage) {
                  handlePageChange(currentPage + 1);
                }
              }}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}