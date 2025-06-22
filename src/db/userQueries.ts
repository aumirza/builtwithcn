import { db } from "@/db/db";
import { user, userRoleEnum } from "@/db/schemas/auth-schema";
import { eq, desc, count } from "drizzle-orm";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Get all users with pagination
export async function getUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const users = await db
    .select()
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset(offset);

  const totalUsers = await db.select({ count: count() }).from(user);

  return {
    users,
    totalUsers: totalUsers[0].count,
    totalPages: Math.ceil(totalUsers[0].count / limit),
    currentPage: page,
  };
}

// Get user by ID
export async function getUserById(userId: string) {
  const users = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return users[0] || null;
}

// Update user role
export async function updateUserRole(userId: string, newRole: UserRole) {
  const updatedUsers = await db
    .update(user)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning();

  return updatedUsers[0];
}

// Create user if not exists (for auth integration)
export async function createOrUpdateUser(userData: {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
}) {
  const existingUser = await getUserById(userData.id);

  if (existingUser) {
    // Update existing user
    const updatedUsers = await db
      .update(user)
      .set({
        name: userData.name,
        email: userData.email,
        image: userData.image || null,
        emailVerified: userData.emailVerified || existingUser.emailVerified,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userData.id))
      .returning();

    return updatedUsers[0];
  } else {
    // Create new user with default role
    const newUsers = await db
      .insert(user)
      .values({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image || null,
        emailVerified: userData.emailVerified || false,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newUsers[0];
  }
}

// Get users by role
export async function getUsersByRole(role: UserRole) {
  return await db
    .select()
    .from(user)
    .where(eq(user.role, role))
    .orderBy(desc(user.createdAt));
}

// Get user statistics
export async function getUserStats() {
  const stats = await db
    .select({
      role: user.role,
      count: count(),
    })
    .from(user)
    .groupBy(user.role);

  const totalUsers = await db.select({ count: count() }).from(user);

  return {
    total: totalUsers[0].count,
    byRole: stats.reduce((acc, stat) => {
      acc[stat.role] = stat.count;
      return acc;
    }, {} as Record<UserRole, number>),
  };
}

// Delete user (admin only)
export async function deleteUser(userId: string) {
  const deletedUsers = await db
    .delete(user)
    .where(eq(user.id, userId))
    .returning();

  return deletedUsers[0];
}

// Check if user has permission for action
export function hasPermission(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    moderator: 2,
    admin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Check if user can manage another user
export function canManageUser(
  currentUserRole: UserRole,
  targetUserRole: UserRole
): boolean {
  // Admins can manage everyone
  if (currentUserRole === "admin") return true;

  // Moderators can only manage regular users
  if (currentUserRole === "moderator" && targetUserRole === "user") return true;

  // Users can't manage anyone
  return false;
}
