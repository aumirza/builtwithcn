"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Heart, Eye, Globe, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { getCategoryLabel } from "@/lib/constants";
import { toggleLike, incrementWebsiteViews } from "@/actions/website-actions";
import type { WebsiteWithDetails } from "@/db/websiteQueries";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: WebsiteWithDetails;
  isLiked: boolean;
  currentUserId?: number;
  onLikeToggle: (websiteId: number, isLiked: boolean, newCount: number) => void;
}

export function WebsiteCard({
  website,
  isLiked,
  currentUserId,
  onLikeToggle,
}: WebsiteCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleLike = async () => {
    if (!currentUserId) return;

    startTransition(async () => {
      try {
        const result = await toggleLike(website.id, String(currentUserId));
        if (result.success) {
          const newCount = result.liked
            ? website.likeCount + 1
            : website.likeCount - 1;
          onLikeToggle(website.id, !!result.liked, newCount);
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    });
  };

  const handleVisit = async () => {
    try {
      await incrementWebsiteViews(website.id);
      window.open(website.liveUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error incrementing views:", error);
      window.open(website.liveUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="group overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 gap-0 p-0">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-muted/50 relative">
          {!imageLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={website.imageUrl}
            alt={website.title}
            fill
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Overlay Actions - appears on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-black/20 flex items-center justify-center gap-2">
          <Button
            onClick={handleVisit}
            size="sm"
            className="backdrop-blur-sm bg-white/90 text-black hover:bg-white"
          >
            <Globe className="w-4 h-4 mr-1" />
            Visit
          </Button>
          {website.sourceUrl && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="backdrop-blur-sm bg-white/90 border-white/20 text-black hover:bg-white"
            >
              <Link href={website.sourceUrl} target="_blank">
                <Github className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 space-y-4">
        {/* Header with title and category */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 flex-1">
              {website.title}
            </h3>
            <Badge variant="secondary" className="text-xs shrink-0">
              {getCategoryLabel(website.category)}
            </Badge>
          </div>
          {website.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {website.description}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{website.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{website.likeCount}</span>
            </div>
          </div>
          <time dateTime={website.createdAt.toISOString()}>
            {format(website.createdAt, "MMM dd, yyyy")}
          </time>
        </div>

        {/* Author and Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={website.submittedBy.image || undefined} />
              <AvatarFallback className="text-xs">
                {website.submittedBy.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {website.submittedBy.name}
            </span>
          </div>

          {currentUserId ? (
            <Button
              onClick={handleToggleLike}
              disabled={isPending}
              size="sm"
              variant={isLiked ? "default" : "outline"}
              className="h-8 px-3"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              )}
            </Button>
          ) : (
            ""
          )}
        </div>
      </CardContent>
    </Card>
  );
}
