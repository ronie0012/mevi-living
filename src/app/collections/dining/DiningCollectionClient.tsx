'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import { DiningProductCard } from '@/components/ui/DiningProductCard';
import { Button } from '@/components/ui/button';
import { 
  getDiningProducts, 
  getAvailableMaterials, 
  getPriceRange, 
  DINING_COLLECTION,
  type SortKey 
} from '@/lib/dining-data';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export default function DiningCollectionClient() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState<SortKey>('featured');
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>(() => {
    const range = getPriceRange();
    return [range.min, range.max];
  });
  const [showFilters, setShowFilters] = React.useState(false);

  const availableMaterials = getAvailableMaterials();
  const fullPriceRange = getPriceRange();

  // Get products with current filters
  const { products, pagination } = React.useMemo(() => {
    // Start with all products
    let allProducts = getDiningProducts(1, 100, sortKey).products;

    // Apply material filter
    if (selectedMaterials.length > 0) {
      allProducts = allProducts.filter(product => 
        selectedMaterials.some(material => 
          product.material?.toLowerCase().includes(material.toLowerCase())
        )
      );
    }

    // Apply price filter
    allProducts = allProducts.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Paginate filtered results
    const productsPerPage = 8;
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    return {
      products: paginatedProducts,
      pagination: {
        currentPage,
        totalPages,
        totalProducts: allProducts.length,
        productsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      }
    };
  }, [currentPage, sortKey, selectedMaterials, priceRange]);

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSelectedMaterials([]);
    setPriceRange([fullPriceRange.min, fullPriceRange.max]);
    setCurrentPage(1);
  };

  const activeFilterCount = selectedMaterials.length + 
    (priceRange[0] !== fullPriceRange.min || priceRange[1] !== fullPriceRange.max ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear all filters ({activeFilterCount})
        </Button>
      )}

      {/* Material Filter */}
      <div>
        <h3 className="font-medium mb-3">Material</h3>
        <div className="space-y-2">
          {availableMaterials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={material}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => handleMaterialToggle(material)}
              />
              <label 
                htmlFor={material} 
                className="text-sm font-normal cursor-pointer"
              >
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-medium mb-3">
          Price: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
        </h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => handlePriceRangeChange(value as [number, number])}
          max={fullPriceRange.max}
          min={fullPriceRange.min}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹{fullPriceRange.min.toLocaleString()}</span>
          <span>₹{fullPriceRange.max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            {DINING_COLLECTION.title}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            {DINING_COLLECTION.description}
          </p>
          <div className="text-sm text-gray-500">
            {pagination.totalProducts} product{pagination.totalProducts !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          {/* Mobile Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-accent text-white text-xs rounded-full px-1.5 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your dining collection search
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters Toggle */}
          <Button 
            variant="outline" 
            className="hidden md:flex"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-accent text-white text-xs rounded-full px-1.5 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
            <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
                <SelectItem value="alpha-asc">A-Z</SelectItem>
                <SelectItem value="alpha-desc">Z-A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="date-desc">Newest</SelectItem>
                <SelectItem value="date-asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          {showFilters && (
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="font-medium text-lg mb-4">Filters</h2>
                <FiltersContent />
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Filter className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {products.map((product, index) => (
                    <DiningProductCard 
                      key={product.id} 
                      product={product} 
                      priority={currentPage === 1 && index < 4}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPreviousPage}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}