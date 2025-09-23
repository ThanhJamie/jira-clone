"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";

async function getOrganizationId() {
  const { userId, orgId, sessionClaims } = auth();

  // Try multiple sources for orgId
  let organizationId = orgId;

  if (!organizationId && sessionClaims?.org_id) {
    organizationId = sessionClaims.org_id;
  }

  if (!organizationId && sessionClaims?.o?.id) {
    organizationId = sessionClaims.o.id;
  }

  if (!organizationId) {
    const headersList = headers();
    organizationId = headersList.get("x-clerk-org-id");
  }

  return { userId, organizationId };
}

export async function createProject(data) {
  try {
    const { userId, organizationId } = await getOrganizationId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!organizationId) {
      throw new Error("No Organization Selected");
    }

    // Verify user is admin of the organization
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
      throw new Error("Only organization admins can create projects");
    }

    // Check if project key already exists in this organization
    const existingProject = await db.project.findFirst({
      where: {
        organizationId,
        key: data.key,
      },
    });

    if (existingProject) {
      throw new Error(
        `Project with key "${data.key}" already exists in this organization`
      );
    }

    // Create project
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId,
      },
    });

    return project;
  } catch (error) {
    // Handle Prisma unique constraint errors specifically
    if (error.code === "P2002") {
      throw new Error(
        `Project with key "${data.key}" already exists in this organization`
      );
    }
    throw new Error("Error creating project: " + error.message);
  }
}

export async function getProjects(orgId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  try {
    const projects = await db.project.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Error fetching projects: " + error.message);
  }
}

export async function deleteProject(projectId) {
  try {
    const { userId, organizationId } = await getOrganizationId();

    if (!userId) throw new Error("Unauthorized");
    if (!organizationId) throw new Error("No Organization Selected");

    // Verify admin permissions
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId,
      });

    const isAdmin = membershipList.some(
      (membership) =>
        membership.publicUserData.userId === userId &&
        membership.role === "org:admin"
    );

    if (!isAdmin)
      throw new Error("Only organization admins can delete projects");

    // Verify project exists and belongs to organization
    const project = await db.project.findUnique({ where: { id: projectId } });

    if (!project || project.organizationId !== organizationId) {
      throw new Error("Project not found or access denied");
    }

    // Delete project
    await db.project.delete({ where: { id: projectId } });

    return { success: true };
  } catch (error) {
    throw new Error("Error deleting project: " + error.message);
  }
}

export async function getProject(projectId) {
  const { userId, organizationId } = await getOrganizationId();
  if (!userId) throw new Error("Unauthorized");
  if (!organizationId) throw new Error("No Organization Selected");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    // throw new Error("Project not found");
    return null;
  }

  if (project.organizationId !== organizationId) {
    return null;
  }

  return project;
}
