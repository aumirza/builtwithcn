import { RoleGuard } from "@/components/auth/RoleGuard";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ActivityCards } from "@/components/admin/ActivityCards";
import { RecentSubmissionsList } from "@/components/admin/RecentSubmissionsList";
import {
  getDashboardStats,
  getRecentSubmissions,
} from "@/actions/admin-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | BuiltWithCN",
  description: "Manage website submissions and user activity",
};

export default async function AdminPage() {
  // Fetch data server-side
  const [statsResult, submissionsResult] = await Promise.all([
    getDashboardStats(),
    getRecentSubmissions(5),
  ]);

  return (
    <RoleGuard requiredRole="admin">
      <div className="space-y-6">
        <DashboardHeader />

        {(!statsResult.success || !submissionsResult.success) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {statsResult.error || submissionsResult.error}
            </AlertDescription>
          </Alert>
        )}

        <StatsGrid
          stats={statsResult.success ? statsResult.data : undefined}
          loading={false}
        />

        <ActivityCards
          stats={statsResult.success ? statsResult.data : undefined}
          loading={false}
        />

        <RecentSubmissionsList
          submissions={
            submissionsResult.success ? submissionsResult.data : undefined
          }
          loading={false}
        />
      </div>
    </RoleGuard>
  );
}
