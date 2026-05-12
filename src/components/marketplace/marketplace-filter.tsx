import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

interface MarketplaceFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export default function MarketplaceFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: MarketplaceFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search healthy products..."
          className="pl-12 py-7 w-full bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#7CB342] transition-all text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-2xl bg-white py-7 px-6 border-none shadow-sm hover:bg-gray-50 transition-all font-bold text-gray-700 flex gap-2 items-center"
          >
            <Filter className="w-4 h-4" />
            {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl p-2 shadow-xl border-none"
        >
          <DropdownMenuRadioGroup
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            {categories.map((category) => (
              <DropdownMenuRadioItem
                key={category}
                value={category}
                className="cursor-pointer rounded-xl py-3 px-4 font-medium transition-colors"
              >
                {category}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
