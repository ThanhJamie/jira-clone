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

  console.log("userId | orgId", userId, organizationId);

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
