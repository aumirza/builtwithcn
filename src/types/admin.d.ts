// Dashboard stats interface
export interface DashboardStats {
  totalWebsites: number;
  totalUsers: number;
  pendingReviews: number;
  approvedToday: number;
  rejectedToday: number;
  totalViews: number;
  totalLikes: number;
  growthRate: number;
}

// Recent submission interface
export interface RecentSubmission {
  id: number;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: string;
  category: string;
}
