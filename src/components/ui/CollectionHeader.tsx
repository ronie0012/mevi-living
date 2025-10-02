import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CollectionHeaderProps {
  title: string;
  description?: string;
  productCount: number;
  breadcrumbs: BreadcrumbItem[];
}

export function CollectionHeader({ 
  title, 
  description, 
  productCount, 
  breadcrumbs 
}: CollectionHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Collection Title and Description */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          {description && (
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {description}
            </p>
          )}
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>{productCount} product{productCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}