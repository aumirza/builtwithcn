import "dotenv/config";
import { db } from "./db";
import { website, websiteLike, websiteComment } from "./schemas/website-schema";
import { user } from "./schemas/auth-schema";
import { account } from "./schemas/auth-schema";
import { hashPassword } from "better-auth/crypto";

const seedUsers = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@builtwithcn.com",
    emailVerified: true,
    role: "admin" as const,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    password: "admin123",
  },
  {
    id: "mod-1",
    name: "Sarah Johnson",
    email: "sarah@builtwithcn.com",
    emailVerified: true,
    role: "moderator" as const,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    password: "mod123",
  },
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    emailVerified: true,
    role: "user" as const,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    password: "user123",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    emailVerified: true,
    role: "user" as const,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    password: "user123",
  },
  {
    id: "user-3",
    name: "Alex Chen",
    email: "alex@example.com",
    emailVerified: true,
    role: "user" as const,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    password: "user123",
  },
  {
    id: "user-4",
    name: "Maria Garcia",
    email: "maria@example.com",
    emailVerified: false,
    role: "user" as const,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    password: "user123",
  },
];

const seedWebsites = [
  {
    title: "Modern E-commerce Dashboard",
    description:
      "A comprehensive e-commerce dashboard built with Next.js and shadcn/ui. Features real-time analytics, inventory management, order tracking, and customer insights. Includes dark mode support and responsive design.",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    sourceUrl: "https://github.com/example/ecommerce-dashboard",
    liveUrl: "https://ecommerce-dashboard-demo.vercel.app",
    tags: ["dashboard", "analytics", "e-commerce", "charts", "dark-mode"],
    category: "e-commerce" as const,
    isPopular: true,
    status: "approved" as const,
    submittedBy: "user-1",
    reviewedBy: "mod-1",
    viewCount: 2540,
    publishedAt: new Date("2024-01-15"),
  },
  {
    title: "Developer Portfolio v2",
    description:
      "Clean and modern portfolio website showcasing projects, skills, and experience. Built with TypeScript, Next.js, and Tailwind CSS. Features smooth animations, blog section, and contact form.",
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=600&fit=crop",
    sourceUrl: "https://github.com/example/portfolio-v2",
    liveUrl: "https://portfolio-v2-demo.vercel.app",
    tags: ["portfolio", "animations", "blog", "contact-form", "typescript"],
    category: "portfolio" as const,
    isPopular: false,
    status: "approved" as const,
    submittedBy: "user-2",
    reviewedBy: "admin-1",
    viewCount: 1890,
    publishedAt: new Date("2024-01-10"),
  },
  {
    title: "SaaS Landing Page Pro",
    description:
      "High-converting SaaS landing page with pricing tables, feature comparisons, and customer testimonials. Optimized for conversion with A/B tested sections and mobile-first design approach.",
    imageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    sourceUrl: null,
    liveUrl: "https://saas-landing-pro.vercel.app",
    tags: [
      "landing-page",
      "pricing",
      "testimonials",
      "conversion",
      "mobile-first",
    ],
    category: "saas" as const,
    isPopular: true,
    status: "approved" as const,
    submittedBy: "user-3",
    reviewedBy: "mod-1",
    viewCount: 3420,
    publishedAt: new Date("2024-01-20"),
  },
  {
    title: "Finance Tracker Dashboard",
    description:
      "Personal finance management dashboard with expense tracking, budget planning, and investment portfolio overview. Features data visualization, goal setting, and financial insights.",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    sourceUrl: "https://github.com/example/finance-tracker",
    liveUrl: "https://finance-tracker-demo.vercel.app",
    tags: ["finance", "dashboard", "charts", "budgeting", "investments"],
    category: "finance" as const,
    isPopular: false,
    status: "approved" as const,
    submittedBy: "user-4",
    reviewedBy: "admin-1",
    viewCount: 1240,
    publishedAt: new Date("2024-01-08"),
  },
  {
    title: "Healthcare Portal",
    description:
      "Patient management system for healthcare providers. Includes appointment scheduling, medical records, prescription management, and telemedicine integration.",
    imageUrl:
      "https://images.unsplash.com/photo-1576765607924-27d6b1c7b6b8?w=800&h=600&fit=crop",
    sourceUrl: "https://github.com/example/healthcare-portal",
    liveUrl: "https://healthcare-portal-demo.vercel.app",
    tags: ["healthcare", "appointments", "medical-records", "telemedicine"],
    category: "healthcare" as const,
    isPopular: true,
    status: "approved" as const,
    submittedBy: "user-1",
    reviewedBy: "mod-1",
    viewCount: 2180,
    publishedAt: new Date("2024-01-25"),
  },
  {
    title: "Education Platform",
    description:
      "Online learning platform with course management, video streaming, progress tracking, and interactive quizzes. Built for educators and students.",
    imageUrl:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
    sourceUrl: null,
    liveUrl: "https://education-platform-demo.vercel.app",
    tags: [
      "education",
      "courses",
      "video-streaming",
      "quizzes",
      "progress-tracking",
    ],
    category: "education" as const,
    isPopular: false,
    status: "pending" as const,
    submittedBy: "user-2",
    reviewedBy: null,
    viewCount: 0,
    publishedAt: null,
  },
  {
    title: "Blog Platform",
    description:
      "Modern blogging platform with markdown support, SEO optimization, and social sharing. Features comment system, author profiles, and content management.",
    imageUrl:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    sourceUrl: "https://github.com/example/blog-platform",
    liveUrl: "https://blog-platform-demo.vercel.app",
    tags: ["blog", "markdown", "seo", "comments", "cms"],
    category: "blog" as const,
    isPopular: false,
    status: "rejected" as const,
    submittedBy: "user-3",
    reviewedBy: "admin-1",
    viewCount: 0,
    publishedAt: null,
  },
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    console.log("🧹 Cleaning existing data...");
    await db.delete(websiteComment);
    await db.delete(websiteLike);
    await db.delete(website);
    await db.delete(user);
    await db.delete(account);
    console.log("✅ Existing data cleaned successfully!");

    // Insert users
    console.log("👥 Seeding users...");
    for (const userData of seedUsers) {
      const { password, ...userDataWithoutPassword } = userData;

      // Insert user first
      await db.insert(user).values({
        ...userDataWithoutPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Use Better Auth's crypto functions for password hashing
      const hashedPassword = await hashPassword(password);

      await db.insert(account).values({
        id: `account-${userData.id}`,
        accountId: userData.email,
        providerId: "credential",
        userId: userData.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert websites
    console.log("🌐 Seeding websites...");
    const insertedWebsites: (typeof website.$inferSelect)[] = [];
    for (const websiteData of seedWebsites) {
      const [insertedWebsite] = await db
        .insert(website)
        .values({
          ...websiteData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      insertedWebsites.push(insertedWebsite);
    }

    // Add some likes
    console.log("❤️ Seeding likes...");
    const likesData = [
      { websiteId: insertedWebsites[0].id, userId: "user-1" },
      { websiteId: insertedWebsites[0].id, userId: "user-2" },
      { websiteId: insertedWebsites[0].id, userId: "user-3" },
      { websiteId: insertedWebsites[1].id, userId: "user-1" },
      { websiteId: insertedWebsites[1].id, userId: "user-4" },
      { websiteId: insertedWebsites[2].id, userId: "user-2" },
      { websiteId: insertedWebsites[2].id, userId: "user-3" },
      { websiteId: insertedWebsites[2].id, userId: "user-4" },
      { websiteId: insertedWebsites[3].id, userId: "user-1" },
      { websiteId: insertedWebsites[4].id, userId: "user-2" },
      { websiteId: insertedWebsites[4].id, userId: "user-3" },
    ];

    for (const likeData of likesData) {
      await db.insert(websiteLike).values({
        ...likeData,
        createdAt: new Date(),
      });
    }

    // Add some comments
    console.log("💬 Seeding comments...");
    const commentsData = [
      {
        websiteId: insertedWebsites[0].id,
        userId: "user-2",
        content:
          "Amazing dashboard! The analytics section is particularly impressive. Great work on the responsive design.",
      },
      {
        websiteId: insertedWebsites[0].id,
        userId: "user-3",
        content:
          "Love the dark mode implementation. Could you share how you handled the theme switching?",
      },
      {
        websiteId: insertedWebsites[1].id,
        userId: "user-1",
        content:
          "Clean and professional portfolio. The animations are smooth and not overwhelming.",
      },
      {
        websiteId: insertedWebsites[2].id,
        userId: "user-4",
        content:
          "This landing page converts really well. The pricing section is very clear and compelling.",
      },
      {
        websiteId: insertedWebsites[4].id,
        userId: "user-1",
        content:
          "Excellent work on the healthcare portal. The appointment system is very user-friendly.",
      },
    ];

    for (const commentData of commentsData) {
      await db.insert(websiteComment).values({
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log("✅ Database seeding completed successfully!");
    console.log(
      `📊 Seeded ${seedUsers.length} users, ${seedWebsites.length} websites, ${likesData.length} likes, and ${commentsData.length} comments`
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}
