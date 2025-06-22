"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { website, websiteLike } from "@/db/schemas/website-schema";
import { user } from "@/db/schemas/auth-schema";
import { count, eq, gte, sql, desc, like, or, and } from "drizzle-orm";

// Get dashboard stats
export async function getDashboardStats() {
  try {
    // Get total websites
    const totalWebsitesResult = await db
      .select({ count: count() })
      .from(website);
    const totalWebsites = Number(totalWebsitesResult[0]?.count || 0);

    // Get total users
    const totalUsersResult = await db.select({ count: count() }).from(user);
    const totalUsers = Number(totalUsersResult[0]?.count || 0);

    // Get pending reviews
    const pendingReviewsResult = await db
      .select({ count: count() })
      .from(website)
      .where(eq(website.status, "pending"));
    const pendingReviews = Number(pendingReviewsResult[0]?.count || 0);

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get approved today
    const approvedTodayResult = await db
      .select({ count: count() })
      .from(website)
      .where(
        sql`${website.status} = 'approved' AND ${website.publishedAt} >= ${today}`
      );
    const approvedToday = Number(approvedTodayResult[0]?.count || 0);

    // Get rejected today
    const rejectedTodayResult = await db
      .select({ count: count() })
      .from(website)
      .where(
        sql`${website.status} = 'rejected' AND ${website.updatedAt} >= ${today}`
      );
    const rejectedToday = Number(rejectedTodayResult[0]?.count || 0);

    // Get total views
    const totalViewsResult = await db
      .select({ totalViews: sql<number>`SUM(${website.viewCount})` })
      .from(website);
    const totalViews = Number(totalViewsResult[0]?.totalViews || 0);

    // Get total likes
    const totalLikesResult = await db
      .select({ count: count() })
      .from(websiteLike);
    const totalLikes = Number(totalLikesResult[0]?.count || 0);

    // Calculate growth rate (websites created in last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentWebsitesResult = await db
      .select({ count: count() })
      .from(website)
      .where(gte(website.createdAt, thirtyDaysAgo));
    const recentWebsites = Number(recentWebsitesResult[0]?.count || 0);

    const previousWebsitesResult = await db
      .select({ count: count() })
      .from(website)
      .where(
        sql`${website.createdAt} >= ${sixtyDaysAgo} AND ${website.createdAt} < ${thirtyDaysAgo}`
      );
    const previousWebsites = Number(previousWebsitesResult[0]?.count || 0);

    const growthRate =
      previousWebsites > 0
        ? ((recentWebsites - previousWebsites) / previousWebsites) * 100
        : 0;

    return {
      success: true,
      data: {
        totalWebsites,
        totalUsers,
        pendingReviews,
        approvedToday,
        rejectedToday,
        totalViews,
        totalLikes,
        growthRate: Math.round(growthRate * 10) / 10, // Round to 1 decimal place
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard stats",
    };
  }
}

// Get recent submissions
export async function getRecentSubmissions(limit = 5) {
  try {
    const recentSubmissions = await db
      .select({
        id: website.id,
        title: website.title,
        submittedBy: user.name, // Use user name instead of object
        submittedAt: website.createdAt,
        status: website.status,
        category: website.category,
      })
      .from(website)
      .leftJoin(user, eq(website.submittedBy, user.id))
      .orderBy(desc(website.createdAt))
      .limit(limit);

    // Transform data to match RecentSubmission interface
    const transformedSubmissions = recentSubmissions.map((submission) => ({
      id: submission.id,
      title: submission.title,
      submittedBy: submission.submittedBy || "Unknown User",
      submittedAt: submission.submittedAt.toISOString(),
      status: submission.status,
      category: submission.category,
    }));

    return {
      success: true,
      data: transformedSubmissions,
    };
  } catch (error) {
    console.error("Error fetching recent submissions:", error);
    return {
      success: false,
      error: "Failed to fetch recent submissions",
    };
  }
}

// Get admin websites with filters
export async function getAdminWebsites(
  filters: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  try {
    const { search = "", status, category, page = 1, limit = 10 } = filters;

    const offset = (page - 1) * limit;

    // Build query with joins to get user info
    const baseQuery = db
      .select({
        id: website.id,
        title: website.title,
        description: website.description,
        imageUrl: website.imageUrl,
        sourceUrl: website.sourceUrl,
        liveUrl: website.liveUrl,
        tags: website.tags,
        category: website.category,
        isPopular: website.isPopular,
        status: website.status,
        viewCount: website.viewCount,
        createdAt: website.createdAt,
        updatedAt: website.updatedAt,
        publishedAt: website.publishedAt,
        submittedBy: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(website)
      .leftJoin(user, eq(website.submittedBy, user.id));

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(website.title, `%${search}%`),
          like(website.description, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(website.status, status));
    }

    if (category) {
      conditions.push(eq(website.category, category));
    }

    // Only chain .where if there are conditions
    const query =
      conditions.length > 0
        ? baseQuery.where(
            conditions.length === 1 ? conditions[0] : and(...conditions)
          )
        : baseQuery;

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(website)
      .leftJoin(user, eq(website.submittedBy, user.id))
      .where(
        conditions.length > 0
          ? conditions.length === 1
            ? conditions[0]
            : sql`${conditions.join(" AND ")}`
          : undefined
      );

    const total = Number(totalResult[0]?.count || 0);

    // Get paginated results
    const websites = await query
      .orderBy(desc(website.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: {
        websites,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching admin websites:", error);
    return {
      success: false,
      error: "Failed to fetch websites",
    };
  }
}

// Update website status
export async function updateWebsiteStatus(
  websiteId: number,
  status: "approved" | "rejected"
) {
  try {
    const updateData: {
      status: "approved" | "rejected";
      updatedAt: Date;
      publishedAt?: Date;
    } = {
      status,
      updatedAt: new Date(),
    };

    if (status === "approved") {
      updateData.publishedAt = new Date();
    }

    await db.update(website).set(updateData).where(eq(website.id, websiteId));

    revalidatePath("/admin/websites");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating website status:", error);
    return { success: false, error: "Failed to update website status" };
  }
}

// Delete website
export async function deleteWebsite(websiteId: number) {
  try {
    await db.delete(website).where(eq(website.id, websiteId));

    revalidatePath("/admin/websites");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting website:", error);
    return { success: false, error: "Failed to delete website" };
  }
}

// Get all users
export async function getAdminUsers(
  filters: {
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  try {
    const { search = "", page = 1, limit = 10 } = filters;

    const offset = (page - 1) * limit;

    let query;

    // Apply search filter at query creation
    if (search) {
      query = db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
        })
        .from(user)
        .where(
          or(like(user.name, `%${search}%`), like(user.email, `%${search}%`))
        );
    } else {
      query = db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
        })
        .from(user);
    }

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(user)
      .where(
        search
          ? or(like(user.name, `%${search}%`), like(user.email, `%${search}%`))
          : undefined
      );

    const total = Number(totalResult[0]?.count || 0);

    // Get paginated results
    const users = await query
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return {
      success: false,
      error: "Failed to fetch users",
    };
  }
}

// Update user role
export async function updateUserRole(
  userId: string,
  role: "admin" | "moderator" | "user"
) {
  try {
    await db.update(user).set({ role }).where(eq(user.id, userId));

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    await db.delete(user).where(eq(user.id, userId));

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
