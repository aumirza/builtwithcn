import { db } from "@/db/db";
import {
  website,
  websiteLike,
  websiteComment,
} from "@/db/schemas/website-schema";
import { user } from "@/db/schemas/auth-schema";
import { eq, desc, asc, like, and, or, sql, count } from "drizzle-orm";

export interface WebsiteFilters {
  search?: string;
  category?: string;
  isPopular?: boolean;
  status?: "pending" | "approved" | "rejected";
  sortBy?: "newest" | "oldest" | "popular" | "views";
  limit?: number;
  offset?: number;
}

export interface WebsiteWithDetails {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl: string | null;
  liveUrl: string;
  tags: string[] | null;
  category: string;
  isPopular: boolean;
  status: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  submittedBy: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  reviewedBy: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
}

export async function getWebsites(filters: WebsiteFilters = {}): Promise<{
  websites: WebsiteWithDetails[];
  total: number;
}> {
  const {
    search,
    category,
    isPopular,
    status = "approved",
    sortBy = "newest",
    limit = 12,
    offset = 0,
  } = filters;

  // Build conditions
  const conditions = [eq(website.status, status)];

  if (search) {
    conditions.push(
      or(
        like(website.title, `%${search}%`),
        like(website.description, `%${search}%`),
        sql`${website.tags} && ARRAY[${search}]::text[]`
      )
    );
  }

  if (category && category !== "all") {
    conditions.push(eq(website.category, category as any));
  }

  if (isPopular !== undefined) {
    conditions.push(eq(website.isPopular, isPopular));
  }

  // Build order by
  let orderBy;
  switch (sortBy) {
    case "oldest":
      orderBy = asc(website.createdAt);
      break;
    case "popular":
      orderBy = desc(website.isPopular);
      break;
    case "views":
      orderBy = desc(website.viewCount);
      break;
    default:
      orderBy = desc(website.createdAt);
  }

  // Get websites with user details
  const websitesQuery = db
    .select({
      website: website,
      submittedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(website)
    .innerJoin(user, eq(website.submittedBy, user.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const websites = await websitesQuery;

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(website)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = totalResult[0]?.count || 0;

  // Get reviewer details and counts for each website
  const websitesWithDetails: WebsiteWithDetails[] = await Promise.all(
    websites.map(async ({ website: w, submittedBy }) => {
      // Get reviewer details if exists
      let reviewedBy = null;
      if (w.reviewedBy) {
        const reviewer = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          })
          .from(user)
          .where(eq(user.id, w.reviewedBy))
          .limit(1);

        if (reviewer.length > 0) {
          reviewedBy = reviewer[0];
        }
      }

      // Get like count
      const likeCountResult = await db
        .select({ count: count() })
        .from(websiteLike)
        .where(eq(websiteLike.websiteId, w.id));

      const likeCount = likeCountResult[0]?.count || 0;

      // Get comment count
      const commentCountResult = await db
        .select({ count: count() })
        .from(websiteComment)
        .where(eq(websiteComment.websiteId, w.id));

      const commentCount = commentCountResult[0]?.count || 0;

      return {
        ...w,
        likeCount,
        commentCount,
        submittedBy,
        reviewedBy,
      };
    })
  );

  return {
    websites: websitesWithDetails,
    total,
  };
}

export async function getWebsiteById(
  id: number
): Promise<WebsiteWithDetails | null> {
  const result = await db
    .select({
      website: website,
      submittedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(website)
    .innerJoin(user, eq(website.submittedBy, user.id))
    .where(eq(website.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const { website: w, submittedBy } = result[0];

  // Get reviewer details if exists
  let reviewedBy = null;
  if (w.reviewedBy) {
    const reviewer = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, w.reviewedBy))
      .limit(1);

    if (reviewer.length > 0) {
      reviewedBy = reviewer[0];
    }
  }

  // Get like count
  const likeCountResult = await db
    .select({ count: count() })
    .from(websiteLike)
    .where(eq(websiteLike.websiteId, w.id));

  const likeCount = likeCountResult[0]?.count || 0;

  // Get comment count
  const commentCountResult = await db
    .select({ count: count() })
    .from(websiteComment)
    .where(eq(websiteComment.websiteId, w.id));

  const commentCount = commentCountResult[0]?.count || 0;

  return {
    ...w,
    submittedBy,
    reviewedBy,
    likeCount: Number(likeCount),
    commentCount: Number(commentCount),
  };
}

export async function createWebsite(data: {
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl?: string;
  liveUrl: string;
  tags: string[];
  category: string;
  submittedBy: string;
}) {
  const [newWebsite] = await db
    .insert(website)
    .values({
      ...data,
      sourceUrl: data.sourceUrl || null,
      status: "pending",
      isPopular: false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newWebsite;
}

export async function updateWebsiteStatus(
  id: number,
  status: "pending" | "approved" | "rejected",
  reviewedBy: string
) {
  const [updatedWebsite] = await db
    .update(website)
    .set({
      status: status as any,
      reviewedBy,
      publishedAt: status === "approved" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(website.id, id))
    .returning();

  return updatedWebsite;
}

export async function toggleWebsitePopular(id: number, isPopular: boolean) {
  const [updatedWebsite] = await db
    .update(website)
    .set({
      isPopular,
      updatedAt: new Date(),
    })
    .where(eq(website.id, id))
    .returning();

  return updatedWebsite;
}

export async function incrementWebsiteViews(id: number) {
  await db
    .update(website)
    .set({
      viewCount: sql`${website.viewCount} + 1`,
    })
    .where(eq(website.id, id));
}

export async function toggleWebsiteLike(websiteId: number, userId: string) {
  // Check if like exists
  const existingLike = await db
    .select()
    .from(websiteLike)
    .where(
      and(eq(websiteLike.websiteId, websiteId), eq(websiteLike.userId, userId))
    )
    .limit(1);

  if (existingLike.length > 0) {
    // Remove like
    await db
      .delete(websiteLike)
      .where(
        and(
          eq(websiteLike.websiteId, websiteId),
          eq(websiteLike.userId, userId)
        )
      );
    return false;
  } else {
    // Add like
    await db.insert(websiteLike).values({
      websiteId,
      userId,
      createdAt: new Date(),
    });
    return true;
  }
}

export async function getWebsiteComments(websiteId: number) {
  const comments = await db
    .select({
      comment: websiteComment,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(websiteComment)
    .innerJoin(user, eq(websiteComment.userId, user.id))
    .where(eq(websiteComment.websiteId, websiteId))
    .orderBy(desc(websiteComment.createdAt));

  return comments;
}

export async function addWebsiteComment(
  websiteId: number,
  userId: string,
  content: string
) {
  const [newComment] = await db
    .insert(websiteComment)
    .values({
      websiteId,
      userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newComment;
}
