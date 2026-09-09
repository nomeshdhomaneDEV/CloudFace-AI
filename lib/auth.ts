import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Profile, Student, Role } from "@prisma/client";

export type AuthUserWithProfile = {
  id: string;
  email: string;
  profile: Profile & {
    student: Student | null;
  };
};

/**
 * Retrieves the currently authenticated Supabase user using the verified getUser() method.
 * Returns null if unauthenticated or if token verification fails.
 * Does NOT rely on getSession() alone for security decisions.
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch (err) {
    console.error("Error fetching authenticated Supabase user:", err);
    return null;
  }
}

/**
 * Retrieves the full authenticated user profile and student record from Prisma PostgreSQL.
 */
export async function getCurrentProfile(): Promise<AuthUserWithProfile | null> {
  const user = await getCurrentUser();
  if (!user || !user.email) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        student: true,
      },
    });

    if (!profile) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      profile,
    };
  } catch (err) {
    console.error("Error fetching user profile from database:", err);
    return null;
  }
}

/**
 * Server-side authorization check asserting user is authenticated and matches required role.
 */
export async function requireAuth(requiredRole?: Role): Promise<AuthUserWithProfile> {
  const authUser = await getCurrentProfile();
  if (!authUser) {
    throw new Error("UNAUTHORIZED");
  }

  if (requiredRole && authUser.profile.role !== requiredRole) {
    throw new Error("FORBIDDEN");
  }

  return authUser;
}
