"use client";

import { deleteProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useOrganization } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const DeleteProject = ({ projectId }) => {
  const { membership, isLoaded } = useOrganization();
  const router = useRouter();
  const {
    loading: isDeleting,
    error,
    data: deleted,
    fn: deleteProjectFn,
  } = useFetch(deleteProject);

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      deleteProjectFn(projectId);
    }
  };

  useEffect(() => {
    if (deleted?.success) {
      toast.success("Project deleted successfully");
      router.refresh();
    }
  }, [deleted]);

  // Don't render anything while loading
  if (!isLoaded) return null;

  const isAdmin = membership?.role === "org:admin";
  if (!isAdmin) return null;

  return (
    <div>
      <Button
        variant="ghost"
        onClick={handleDelete}
        size={"sm"}
        disabled={isDeleting}
        className={`${isDeleting} ? "animate-pulse" : ""`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default DeleteProject;
