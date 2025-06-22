"use server";

import { revalidatePath } from "next/cache";
import {
  createWebsite,
  getWebsites,
  toggleWebsiteLike,
} from "@/db/websiteQueries";
import { z } from "zod";

// Schema for website submission
const websiteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  liveUrl: z.string().url("Live URL must be a valid URL"),
  sourceUrl: z.string().url("Source URL must be a valid URL").optional(),
  imageUrl: z.string().url("Image URL must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  submittedBy: z.string().min(1, "Submitted by is required"),
});

export type WebsiteFormData = z.infer<typeof websiteSchema>;

// Submit website action
export async function submitWebsite(formData: WebsiteFormData) {
  try {
    const validatedData = websiteSchema.parse(formData);

    const newWebsite = await createWebsite(validatedData);

    revalidatePath("/");
    revalidatePath("/admin/websites");

    return { success: true, website: newWebsite };
  } catch (error) {
    console.error("Error submitting website:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    return { success: false, error: "Failed to submit website" };
  }
}

// Get websites with filters
export async function getWebsitesList(
  filters: {
    search?: string;
    category?: string;
    isPopular?: boolean;
    sortBy?: "newest" | "oldest" | "popular" | "views";
    limit?: number;
    offset?: number;
  } = {}
) {
  try {
    const {
      search,
      category,
      isPopular,
      sortBy = "newest",
      limit = 12,
      offset = 0,
    } = filters;

    const result = await getWebsites({
      search,
      category,
      isPopular,
      sortBy,
      limit,
      offset,
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error fetching websites:", error);
    return {
      success: false,
      error: "Failed to fetch websites",
      websites: [],
      total: 0,
    };
  }
}

// Toggle website like
export async function toggleLike(websiteId: number, userId: string) {
  try {
    if (isNaN(websiteId)) {
      return { success: false, error: "Invalid website ID" };
    }

    const liked = await toggleWebsiteLike(websiteId, userId);

    revalidatePath("/");

    return { success: true, liked };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

// Update website views
export async function incrementWebsiteViews(websiteId: number) {
  try {
    if (isNaN(websiteId)) {
      return { success: false, error: "Invalid website ID" };
    }

    // await updateWebsiteViews(websiteId);

    return { success: true };
  } catch (error) {
    console.error("Error updating views:", error);
    return { success: false, error: "Failed to update views" };
  }
}
