"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Ensure the current Clerk user exists in our database.
 * If not, create a new record with default role = PATIENT.
 * If email exists but Clerk ID changed → update Clerk ID.
 */
export async function ensureUserExists() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerk = await currentUser();
  if (!clerk) throw new Error("Clerk user not found");

  const email = clerk.emailAddresses[0].emailAddress;

  // ✅ Use upsert on email (since it's unique)
  const user = await db.user.upsert({
    where: { email }, // email is unique
    update: {
      clerkUserId: clerk.id, // keep Clerk ID synced
      name: `${clerk.firstName || ""} ${clerk.lastName || ""}`.trim(),
    },
    create: {
      clerkUserId: clerk.id,
      email,
      name: `${clerk.firstName || ""} ${clerk.lastName || ""}`.trim(),
      role: "PATIENT", // 👈 default role
    },
  });

  return user;
}

/**
 * Sets the user's role and related information
 */
export async function setUserRole(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Make sure user exists in DB
  const user = await ensureUserExists();
  if (!user) throw new Error("User not found in database");

  const role = formData.get("role");

  if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
    // ✅ If patient → simple update
    if (role === "PATIENT") {
      await db.user.update({
        where: { email: user.email },
        data: { role: "PATIENT" },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    // ✅ If doctor → require extra fields
    if (role === "DOCTOR") {
      const specialty = formData.get("specialty");
      const experience = parseInt(formData.get("experience"), 10);
      const credentialUrl = formData.get("credentialUrl");
      const description = formData.get("description");

      if (!specialty || !experience || !credentialUrl || !description) {
        throw new Error("All fields are required");
      }

      await db.user.update({
        where: { email: user.email },
        data: {
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: "PENDING",
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification" };
    }
  } catch (error) {
    console.error("Failed to set user role:", error);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

/**
 * Get the current user's complete profile information
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    return await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  } catch (error) {
    console.error("Failed to get user information:", error);
    return null;
  }
}
