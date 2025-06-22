import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <RoleGuard requiredRole="moderator">
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </RoleGuard>
    </div>
  );
}
