import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';

// Removed TypeScript interface; in JavaScript, we rely on runtime types.
const ProductFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    categories: [],
    ratings: 0,
    sortBy: 'featured',
    inStock: true,
    onSaleOnly: false,
  });

  const categories = [
    'Books & Journals',
    'Aromatherapy',
    'Meditation Tools',
    'Sleep Aids',
    'Supplements',
    'Self-Care Kits',
    'Stress Relief Tools',
    'Mindfulness Accessories',
  ];

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'newest', label: 'Newest Arrivals' },
    { id: 'priceAsc', label: 'Price: Low to High' },
    { id: 'priceDesc', label: 'Price: High to Low' },
    { id: 'ratings', label: 'Highest Rated' },
  ];

  const handlePriceRangeChange = (value) => {
    setFilters({
      ...filters,
      priceRange: value,
    });
  };

  const handleCategoryChange = (category, checked) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(cat => cat !== category);
    
    setFilters({
      ...filters,
      categories: updatedCategories,
    });
  };

  const handleRatingChange = (value) => {
    setFilters({
      ...filters,
      ratings: value[0],
    });
  };

  const handleSortChange = (value) => {
    setFilters({
      ...filters,
      sortBy: value,
    });
  };

  const handleStockChange = (checked) => {
    setFilters({
      ...filters,
      inStock: checked,
    });
  };

  const handleSaleChange = (checked) => {
    setFilters({
      ...filters,
      onSaleOnly: checked,
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priceRange: [0, 200],
      categories: [],
      ratings: 0,
      sortBy: 'featured',
      inStock: true,
      onSaleOnly: false,
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="w-full">
      {/* Mobile filters */}
      <div className="md:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              <span>Filters & Sort</span>
              <Filter className="h-4 w-4 ml-2" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Sort By</h3>
                <RadioGroup
                  value={filters.sortBy}
                  onValueChange={handleSortChange}
                  className="space-y-2"
                >
                  {sortOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`mobile-sort-${option.id}`} />
                      <Label htmlFor={`mobile-sort-${option.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between mb-3">
                  <h3 className="text-lg font-medium">Price Range</h3>
                  <span className="text-sm text-gray-600">
                    ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={200}
                  step={10}
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked)
                        }
                      />
                      <Label htmlFor={`mobile-category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between mb-3">
                  <h3 className="text-lg font-medium">Minimum Rating</h3>
                  <span className="text-sm text-gray-600">{filters.ratings}+ stars</span>
                </div>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={[filters.ratings]}
                  onValueChange={handleRatingChange}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-3">Availability</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobile-in-stock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => handleStockChange(checked)}
                  />
                  <Label htmlFor="mobile-in-stock">Show in-stock items only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobile-on-sale"
                    checked={filters.onSaleOnly}
                    onCheckedChange={(checked) => handleSaleChange(checked)}
                  />
                  <Label htmlFor="mobile-on-sale">Show sale items only</Label>
                </div>
              </div>
            </div>
            
            <SheetFooter className="flex-row gap-3 sm:justify-between">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <SheetClose asChild>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-oasis-primary hover:bg-oasis-primary/90"
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop filters */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Sort By</h3>
              <RadioGroup
                value={filters.sortBy}
                onValueChange={handleSortChange}
                className="space-y-2"
              >
                {sortOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`sort-${option.id}`} />
                    <Label htmlFor={`sort-${option.id}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-medium">Price Range</h3>
                <span className="text-sm text-gray-600">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
              </div>
              <Slider
                min={0}
                max={200}
                step={10}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
              />
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked)
                      }
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-medium">Minimum Rating</h3>
                <span className="text-sm text-gray-600">{filters.ratings}+ stars</span>
              </div>
              <Slider
                min={0}
                max={5}
                step={1}
                value={[filters.ratings]}
                onValueChange={handleRatingChange}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium mb-3">Availability</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => handleStockChange(checked)}
                />
                <Label htmlFor="in-stock">Show in-stock items only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-sale"
                  checked={filters.onSaleOnly}
                  onCheckedChange={(checked) => handleSaleChange(checked)}
                />
                <Label htmlFor="on-sale">Show sale items only</Label>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-oasis-primary hover:bg-oasis-primary/90"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
