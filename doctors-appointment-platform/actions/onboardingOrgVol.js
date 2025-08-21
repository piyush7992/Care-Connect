"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

/**
 * Get the full current user from database + Clerk
 */
export async function getCurrentUser() {
  const clerk = await currentUser();
  if (!clerk) return null;

  // Find the user in your database by Clerk ID or email
  const user = await db.user.findFirst({
    where: {
      OR: [
        { clerkUserId: clerk.id },
        { email: clerk.emailAddresses[0]?.emailAddress },
      ],
    },
  });

  // If user exists in DB, return it; else fallback to Clerk info
  if (user) return user;

  return {
    id: clerk.id,
    email: clerk.emailAddresses[0].emailAddress,
    role: clerk.publicMetadata?.role || "UNASSIGNED",
    name: clerk.fullName,
    imageUrl: clerk.imageUrl,
  };
}

/**
 * Set role for Organization / Volunteer
 */
export async function setOrgVolRole(formData) {
  const clerk = await currentUser();
  if (!clerk) throw new Error("Clerk user not found");

  // Extract form data
  const role = formData.get("role");
  if (!role) throw new Error("Role is required");

  // Map frontend role string → Prisma enum
  const roleEnum = {
    ORGANIZATION: UserRole.ORGANIZATION,
    VOLUNTEER: UserRole.VOLUNTEER,
  }[role];

  if (!roleEnum) throw new Error("Invalid role for this onboarding flow");

  // Find existing user
  let user = await db.user.findFirst({
    where: {
      OR: [
        { clerkUserId: clerk.id },
        { email: clerk.emailAddresses[0]?.emailAddress },
      ],
    },
  });

  const data =
    roleEnum === UserRole.ORGANIZATION
      ? {
          orgName: formData.get("orgName"),
          orgMission: formData.get("orgMission"),
          orgContactNumber: formData.get("orgContactNumber"),
          orgAddress: formData.get("orgAddress"),
          verificationStatus: "PENDING",
        }
      : {
          volSkills: formData.get("volSkills"),
          volLanguages: formData.get("volLanguages"),
          volExperienceLevel: formData.get("volExperienceLevel"),
        };

  if (user) {
    // Update existing user
    user = await db.user.update({
      where: { id: user.id },
      data: {
        clerkUserId: clerk.id,
        role: roleEnum,
        ...data,
      },
    });
  } else {
    // Create new user
    user = await db.user.create({
      data: {
        clerkUserId: clerk.id,
        email: clerk.emailAddresses[0]?.emailAddress,
        name: clerk.fullName,
        imageUrl: clerk.imageUrl,
        role: roleEnum,
        ...data,
      },
    });
  }

  return user;
}
