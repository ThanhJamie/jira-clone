"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
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

export async function createIssue(projectId, data) {
  const { userId, organizationId } = await getOrganizationId();

  if (!userId || !organizationId) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { createdAt: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;
  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null, // Add this line
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue;
}

export async function getIssuesForSprint(stringId) {
  const { userId, organizationId } = await getOrganizationId();

  if (!userId || !organizationId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    where: { sprintId: stringId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });
  return issues;
}

export async function updateIssueOrder(updatedIssues) {
  const { userId, organizationId } = await getOrganizationId();

  if (!userId || !organizationId) {
    throw new Error("Unauthorized");
  }

  await db.$transaction(async (prisma) => {
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId) {
  const { userId, organizationId } = await getOrganizationId();

  if (!userId || !organizationId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (
    issue.reporterId !== user.id &&
    !issue.project?.adminIds.includes(user.id)
  ) {
    throw new Error("You do not have permission to delete this issue");
  }

  await db.issue.delete({
    where: { id: issueId },
  });

  return { success: true };
}

export async function updateIssue(issueId, data) {
  const { userId, organizationId } = await getOrganizationId();

  if (!userId || !organizationId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== organizationId) {
      throw new Error("You do not have permission to update this issue");
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: { assignee: true, reporter: true },
    });

    return updatedIssue;
  } catch (error) {
    throw new Error("Failed to update issue: " + error.message);
  }
}

export async function getUserIssues(userId) {
  const { organizationId } = await getOrganizationId();

  if (!userId || !organizationId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: userId }, { reporterId: userId }],
      project: { organizationId },
    },
    include: {
      assignee: true,
      reporter: true,
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return issues;
}
