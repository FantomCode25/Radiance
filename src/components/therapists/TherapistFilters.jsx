import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';

// The FiltersProps interface has been removed in the JavaScript translation.
// In TypeScript, it declared the onFilterChange prop. In JavaScript, we simply assume its presence.

const TherapistFilters = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    priceRange: [0, 200],
    minRating: 0,
    languages: [],
    availability: [],
  });

  const specializations = [
    'All Specializations',
    'Anxiety',
    'Depression',
    'Trauma & PTSD',
    'Relationship Issues',
    'Stress Management',
    'Grief',
    'Self-Esteem',
    'Addiction',
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'Mandarin',
    'Hindi',
    'Arabic',
    'German',
  ];

  const availabilityOptions = [
    'Weekdays',
    'Evenings',
    'Weekends',
    'Early Morning',
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleApplyFilters();
  };

  const handleSpecializationChange = (value) => {
    setFilters({
      ...filters,
      specialization: value === 'All Specializations' ? '' : value,
    });
  };

  const handlePriceRangeChange = (value) => {
    setFilters({
      ...filters,
      priceRange: value,
    });
  };

  const handleMinRatingChange = (value) => {
    setFilters({
      ...filters,
      minRating: value[0],
    });
  };

  const handleLanguageChange = (value, checked) => {
    const updatedLanguages = checked
      ? [...filters.languages, value]
      : filters.languages.filter(lang => lang !== value);

    setFilters({
      ...filters,
      languages: updatedLanguages,
    });
  };

  const handleAvailabilityChange = (value, checked) => {
    const updatedAvailability = checked
      ? [...filters.availability, value]
      : filters.availability.filter(avail => avail !== value);

    setFilters({
      ...filters,
      availability: updatedAvailability,
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      ...filters,
      searchQuery,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      specialization: '',
      priceRange: [0, 200],
      minRating: 0,
      languages: [],
      availability: [],
    });

    onFilterChange({
      searchQuery: '',
      specialization: '',
      priceRange: [0, 200],
      minRating: 0,
      languages: [],
      availability: [],
    });
  };

  return (
    <div className="w-full">
      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search therapists by name or specialization..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Specialization</h3>
              <Select onValueChange={handleSpecializationChange} defaultValue="All Specializations">
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                defaultValue={[0, 200]}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-medium">Minimum Rating</h3>
                <span className="text-sm text-gray-600">{filters.minRating} stars</span>
              </div>
              <Slider
                min={0}
                max={5}
                step={0.5}
                defaultValue={[0]}
                value={[filters.minRating]}
                onValueChange={handleMinRatingChange}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Languages</h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={filters.languages.includes(language)}
                      onCheckedChange={(checked) => 
                        handleLanguageChange(language, checked)
                      }
                    />
                    <Label htmlFor={`language-${language}`}>{language}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Availability</h3>
              <div className="grid grid-cols-2 gap-2">
                {availabilityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option}`}
                      checked={filters.availability.includes(option)}
                      onCheckedChange={(checked) => 
                        handleAvailabilityChange(option, checked)
                      }
                    />
                    <Label htmlFor={`availability-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleApplyFilters}
                className="bg-oasis-primary hover:bg-oasis-primary/90 w-full"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="border-gray-300 hover:bg-gray-100"
              >
                <X className="mr-1 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Filters */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search therapists..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Therapists</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Specialization</h3>
                    <Select onValueChange={handleSpecializationChange} defaultValue="All Specializations">
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                      defaultValue={[0, 200]}
                      value={filters.priceRange}
                      onValueChange={handlePriceRangeChange}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-3">
                      <h3 className="text-lg font-medium">Minimum Rating</h3>
                      <span className="text-sm text-gray-600">{filters.minRating} stars</span>
                    </div>
                    <Slider
                      min={0}
                      max={5}
                      step={0.5}
                      defaultValue={[0]}
                      value={[filters.minRating]}
                      onValueChange={handleMinRatingChange}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Languages</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-language-${language}`}
                            checked={filters.languages.includes(language)}
                            onCheckedChange={(checked) => 
                              handleLanguageChange(language, checked)
                            }
                          />
                          <Label htmlFor={`mobile-language-${language}`}>{language}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Availability</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availabilityOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-availability-${option}`}
                            checked={filters.availability.includes(option)}
                            onCheckedChange={(checked) => 
                              handleAvailabilityChange(option, checked)
                            }
                          />
                          <Label htmlFor={`mobile-availability-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <SheetFooter>
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="w-full sm:w-auto border-gray-300 hover:bg-gray-100"
                  >
                    <X className="mr-1 h-4 w-4" /> Reset
                  </Button>
                  <SheetClose asChild>
                    <Button
                      onClick={handleApplyFilters}
                      className="w-full sm:w-auto bg-oasis-primary hover:bg-oasis-primary/90"
                    >
                      Apply Filters
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistFilters;
