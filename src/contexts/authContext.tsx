"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { User, UserRole } from "@/db/userQueries";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  hasRole: (requiredRole: UserRole) => boolean;
  canAccess: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: isLoading } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image || null,
        role: ((session.user as any).role as UserRole) || "user",
        createdAt: session.user.createdAt
          ? new Date(session.user.createdAt)
          : new Date(),
        updatedAt: session.user.updatedAt
          ? new Date(session.user.updatedAt)
          : new Date(),
      }
    : null;

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      moderator: 2,
      admin: 3,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const canAccess = (requiredRole: UserRole): boolean => {
    return hasRole(requiredRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        hasRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
