"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/authContext";
import { UserRole } from "@/db/userQueries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface RoleGuardProps {
  requiredRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
  showError?: boolean;
}

export function RoleGuard({
  requiredRole,
  children,
  fallback,
  showError = true,
}: RoleGuardProps) {
  const { user, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    if (fallback) return <>{fallback}</>;

    if (showError) {
      return (
        <Alert className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to access this content.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  if (!hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>;

    if (showError) {
      return (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have permission to access this content. Required
            role: {requiredRole}, your role: {user.role}.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
}

// Higher-order component for page-level protection
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: UserRole
) {
  return function ProtectedComponent(props: P) {
    return (
      <RoleGuard requiredRole={requiredRole}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}

// Hook for checking permissions in components
export function usePermissions() {
  const { user, hasRole } = useAuth();

  return {
    canSubmitWebsite: hasRole("user"),
    canModerateWebsites: hasRole("moderator"),
    canManageUsers: hasRole("admin"),
    canAccessAdmin: hasRole("moderator"),
    canDeleteWebsites: hasRole("admin"),
    canEditAnyWebsite: hasRole("moderator"),
    canViewAnalytics: hasRole("moderator"),
    isAdmin: user?.role === "admin",
    isModerator: user?.role === "moderator",
    isUser: user?.role === "user",
  };
}
