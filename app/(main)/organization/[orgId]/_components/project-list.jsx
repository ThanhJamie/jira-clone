import { getProjects } from "@/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteProject from "./delete-project";

export default async function ProjectList({ orgId }) {
  //   console.log("ProjectList component - orgId received:", orgId);

  try {
    const projects = await getProjects(orgId);
    // console.log("ProjectList render", { orgId, projects });

    if (projects.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            No projects found in this organization.
          </p>
          <Link
            href="/project/create"
            className="underline underline-offset-2 text-blue-200 hover:text-blue-100"
          >
            Create New Project
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          return (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className={"flex justify-between items-center"}>
                  {project.name}
                  <DeleteProject projectId={project.id}></DeleteProject>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {project.description}
                </p>
                <Link
                  href={`/project/${project.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Project
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Error in ProjectList:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading projects: {error.message}</p>
        <Link
          href="/project/create"
          className="underline underline-offset-2 text-blue-200 mt-4 inline-block"
        >
          Create New Project
        </Link>
      </div>
    );
  }
}
