'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Best selling', value: 'best-selling' },
  { label: 'Alphabetically, A-Z', value: 'alpha-asc' },
  { label: 'Alphabetically, Z-A', value: 'alpha-desc' },
  { label: 'Price, low to high', value: 'price-asc' },
  { label: 'Price, high to low', value: 'price-desc' },
  { label: 'Date, old to new', value: 'date-asc' },
  { label: 'Date, new to old', value: 'date-desc' },
];

interface CollectionToolbarProps {
  totalProducts: number;
  basePath: string;
}

export function CollectionToolbar({ totalProducts, basePath }: CollectionToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'featured') params.delete('sort'); else params.set('sort', value);
    params.delete('page'); // reset paging when changing sort
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {totalProducts} product{totalProducts !== 1 ? 's' : ''}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Sort by:</span>
        <Select value={currentSort} onValueChange={onChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}