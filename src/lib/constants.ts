export const WEBSITE_CATEGORIES = [
  { value: "e-commerce", label: "E-commerce" },
  { value: "portfolio", label: "Portfolio" },
  { value: "blog", label: "Blog" },
  { value: "landing-page", label: "Landing Page" },
  { value: "dashboard", label: "Dashboard" },
  { value: "saas", label: "SaaS" },
  { value: "marketing", label: "Marketing" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "entertainment", label: "Entertainment" },
  { value: "social", label: "Social" },
  { value: "productivity", label: "Productivity" },
  { value: "other", label: "Other" },
] as const;

export const WEBSITE_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "views", label: "Most Viewed" },
  { value: "likes", label: "Most Liked" },
] as const;

export const WEBSITE_STATUSES = [
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

export const USER_ROLES = [
  { value: "user", label: "User" },
  { value: "moderator", label: "Moderator" },
  { value: "admin", label: "Admin" },
] as const;

// Helper functions
export function getCategoryLabel(value: string): string {
  const category = WEBSITE_CATEGORIES.find((cat) => cat.value === value);
  return category?.label || value;
}

export function getStatusLabel(value: string): string {
  const status = WEBSITE_STATUSES.find((s) => s.value === value);
  return status?.label || value;
}

export function getRoleLabel(value: string): string {
  const role = USER_ROLES.find((r) => r.value === value);
  return role?.label || value;
}
