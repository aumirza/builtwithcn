import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { WEBSITE_CATEGORIES, WEBSITE_STATUSES } from "@/lib/constants";

// Enums - dynamically created from constants
export const websiteStatusEnum = pgEnum(
  "website_status",
  WEBSITE_STATUSES.map((status) => status.value) as [string, ...string[]]
);

export const websiteCategoryEnum = pgEnum(
  "website_category",
  WEBSITE_CATEGORIES.map((category) => category.value) as [string, ...string[]]
);

// Websites table
export const website = pgTable(
  "website",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    sourceUrl: text("source_url"), // GitHub/repo URL
    liveUrl: text("live_url").notNull(),
    tags: text("tags").array(), // Array of tags
    category: websiteCategoryEnum("category").notNull(),
    isPopular: boolean("is_popular").default(false).notNull(),
    status: websiteStatusEnum("status").default("pending").notNull(),

    // User who submitted
    submittedBy: text("submitted_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // Admin/moderator who approved/modified
    reviewedBy: text("reviewed_by").references(() => user.id, {
      onDelete: "set null",
    }),

    // Metadata
    viewCount: integer("view_count").default(0).notNull(),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
    publishedAt: timestamp("published_at"),
  },
  (table) => ({
    statusIdx: index("website_status_idx").on(table.status),
    categoryIdx: index("website_category_idx").on(table.category),
    popularIdx: index("website_popular_idx").on(table.isPopular),
    createdAtIdx: index("website_created_at_idx").on(table.createdAt),
  })
);

// Website likes/favorites
export const websiteLike = pgTable(
  "website_like",
  {
    id: serial("id").primaryKey(),
    websiteId: integer("website_id")
      .notNull()
      .references(() => website.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    websiteUserIdx: index("website_like_website_user_idx").on(
      table.websiteId,
      table.userId
    ),
  })
);

// Comments on websites
export const websiteComment = pgTable(
  "website_comment",
  {
    id: serial("id").primaryKey(),
    websiteId: integer("website_id")
      .notNull()
      .references(() => website.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    websiteIdx: index("website_comment_website_idx").on(table.websiteId),
    createdAtIdx: index("website_comment_created_at_idx").on(table.createdAt),
  })
);
