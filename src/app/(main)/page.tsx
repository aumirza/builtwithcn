import { Suspense } from "react";
import { WebsiteGrid } from "@/components/WebsiteGrid";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { HeroSection } from "@/components/HeroSection";

import { getWebsites } from "@/db/websiteQueries";
import { SubmitSection } from "@/components/SubmitSection";

interface HomeProps {
  searchParams: {
    search?: string;
    category?: string;
    sortBy?: string;
    popular?: string;
    page?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  // Extract search parameters with defaults
  const {
    search = "",
    category = "all",
    sortBy = "newest",
    popular = "false",
    page = "1",
  } = searchParams;

  // Convert search params to proper types
  const showPopularOnly = popular === "true";
  const currentPage = parseInt(page);
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  // Fetch initial data server-side
  const { websites: initialWebsites, total } = await getWebsites({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    sortBy: sortBy as "newest" | "oldest" | "popular",
    isPopular: showPopularOnly ? true : undefined,
    limit,
    offset,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Suspense fallback={<div>Loading filters...</div>}>
          <SearchAndFilters
            initialSearch={search}
            initialCategory={category}
            initialSortBy={sortBy}
            initialShowPopular={showPopularOnly}
          />
        </Suspense>

        {/* Website Grid */}
        <Suspense fallback={<div>Loading websites...</div>}>
          <WebsiteGrid
            initialWebsites={initialWebsites}
            initialTotal={total}
            searchQuery={search}
            selectedCategory={category}
            sortBy={sortBy}
            showPopularOnly={showPopularOnly}
          />
        </Suspense>
      </div>

      <SubmitSection />
    </div>
  );
}
