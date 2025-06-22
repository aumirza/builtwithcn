"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { WEBSITE_CATEGORIES } from "@/lib/constants";

// Define sort options locally if not exported
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "views", label: "Most Viewed" },
];

// Helper function to get category label
const getCategoryLabel = (category: string) => {
  const categoryObj = WEBSITE_CATEGORIES.find((cat) => cat.value === category);
  return categoryObj?.label || category;
};

interface SearchAndFiltersProps {
  initialSearch: string;
  initialCategory: string;
  initialSortBy: string;
  initialShowPopular: boolean;
}

export function SearchAndFilters({
  initialSearch,
  initialCategory,
  initialSortBy,
  initialShowPopular,
}: SearchAndFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all" && value !== "false") {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Reset to page 1 when filters change
    current.delete("page");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    startTransition(() => {
      router.push(`/${query}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: searchQuery });
  };

  const handleCategoryChange = (category: string) => {
    updateSearchParams({ category });
  };

  const handleSortChange = (sortBy: string) => {
    updateSearchParams({ sortBy });
  };

  const handlePopularToggle = () => {
    updateSearchParams({
      popular: initialShowPopular ? "false" : "true",
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    startTransition(() => {
      router.push("/");
    });
  };
  const hasActiveFilters =
    initialCategory !== "all" || initialShowPopular || initialSearch;

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative max-w-2xl mx-auto"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search websites by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-3 text-base"
        />
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 justify-center">
        {/* Category Filter */}
        <Select value={initialCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {WEBSITE_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={initialSortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Popular Only Toggle */}
        <Button
          variant={initialShowPopular ? "default" : "outline"}
          size="sm"
          onClick={handlePopularToggle}
          disabled={isPending}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Popular Only
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={isPending}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 justify-center">
          {initialCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {getCategoryLabel(initialCategory)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleCategoryChange("all")}
              />
            </Badge>
          )}
          {initialShowPopular && (
            <Badge variant="secondary" className="gap-1">
              Popular Only
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateSearchParams({ popular: "false" })}
              />
            </Badge>
          )}
          {initialSearch && (
            <Badge variant="secondary" className="gap-1">
              Search: "{initialSearch}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                  updateSearchParams({ search: "" });
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
