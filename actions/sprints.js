"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { db } from "@/lib/prisma";

async function getUserOrgRole(userId, orgId) {
  try {
    const { data: memberships } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });

    const userMembership = memberships?.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (userMembership) {
      return userMembership.role;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user org role:", error);
    return null;
  }
}

export async function createSprint(projectId, data) {
  const { userId } = auth();
  const headersList = headers();
  const orgId = headersList.get("x-clerk-org-id");

  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!orgId) {
    throw new Error("No organization selected");
  }

  // Verify user exists in database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  // Verify project belongs to the organization
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.organizationId !== orgId) {
    throw new Error("Project does not belong to current organization");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId,
    },
  });

  return sprint;
}

export async function updateSprintStatus(sprintId, newStatus) {
  const { userId } = auth();
  const headersList = headers();
  const orgId = headersList.get("x-clerk-org-id");

  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!orgId) {
    throw new Error("No organization selected");
  }

  try {
    // Verify user exists in database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Get user organization role
    const orgRole = await getUserOrgRole(userId, orgId);

    if (!orgRole) {
      throw new Error("User is not a member of this organization");
    }

    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Sprint does not belong to your organization");
    }

    // Check if user has permission to update sprint status
    if (!["org:admin", "org:basic_member"].includes(orgRole)) {
      throw new Error("Only organization members can update sprint status");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error(
        "Sprint can only be started within its start and end date"
      );
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Only active sprints can be completed");
    }

    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error(error.message || "Failed to update sprint status");
  }
}
