"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Grid3X3 } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { getWebsitesList } from "@/actions/website-actions";
import type { WebsiteWithDetails } from "@/db/websiteQueries";
import { WebsiteCard } from "./WebsiteCard";

interface WebsiteGridProps {
  initialWebsites: WebsiteWithDetails[];
  initialTotal: number;
  searchQuery?: string;
  selectedCategory?: string;
  sortBy?: string;
  showPopularOnly?: boolean;
}

export function WebsiteGrid({
  initialWebsites,
  initialTotal,
  searchQuery,
  selectedCategory,
  sortBy,
  showPopularOnly,
}: WebsiteGridProps) {
  const { user } = useAuth();
  const [websites, setWebsites] =
    useState<WebsiteWithDetails[]>(initialWebsites);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [likedWebsites, setLikedWebsites] = useState<Set<number>>(new Set());

  // Reset data when URL parameters change (new search/filter)
  useEffect(() => {
    setWebsites(initialWebsites);
    setTotal(initialTotal);
    setPage(1);
  }, [initialWebsites, initialTotal]);

  const fetchWebsites = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const currentPage = isLoadMore ? page + 1 : 1;
      const offset = (currentPage - 1) * 12;

      const result = await getWebsitesList({
        search: searchQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        sortBy: sortBy as any,
        isPopular: showPopularOnly ? true : undefined,
        limit: 12,
        offset,
      });

      if (result.success) {
        if (isLoadMore) {
          setWebsites((prev) => [...prev, ...result.websites]);
          setPage(currentPage);
        } else {
          setWebsites(result.websites);
          setPage(1);
        }
        setTotal(result.total);
      } else {
        console.error("Error fetching websites:", result.error);
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchWebsites(true);
  };

  const handleLikeToggle = (
    websiteId: number,
    isLiked: boolean,
    newCount: number
  ) => {
    setLikedWebsites((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.add(websiteId);
      } else {
        newSet.delete(websiteId);
      }
      return newSet;
    });

    setWebsites((prev) =>
      prev.map((website) =>
        website.id === websiteId ? { ...website, likeCount: newCount } : website
      )
    );
  };

  if (websites.length === 0 && !loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
          <Grid3X3 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No websites found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any websites matching your criteria. Try adjusting
          your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Discover Projects</h2>
            <p className="text-sm text-muted-foreground">
              {total} amazing websites built with shadcn/ui
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((website) => (
          <WebsiteCard
            key={website.id}
            website={website}
            isLiked={likedWebsites.has(website.id)}
            currentUserId={user?.id ? Number(user.id) : undefined}
            onLikeToggle={handleLikeToggle}
          />
        ))}
      </div>

      {/* Load More */}
      {websites.length < total && (
        <div className="text-center pt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            size="lg"
            variant="outline"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More
                <span className="ml-2 text-xs text-muted-foreground">
                  ({websites.length} of {total})
                </span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
