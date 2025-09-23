import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import SprintCreationForm from "../_components/create-sprint";

const ProjectPage = async ({ params }) => {
  const { projectId } = params;
  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  return (
    <div className="container mx-auto">
      {project.sprints.length > 0 ? (
        <SprintCreationForm
          projectTitle={project.name}
          projectId={projectId}
          projectKey={project.key}
          sprintKey={project.sprints?.length + 1}
        />
      ) : (
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
};

export default ProjectPage;
