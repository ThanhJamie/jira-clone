"use client";

import { updateSprintStatus } from "@/actions/sprints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns/format";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
  const [status, setStatus] = useState(sprint.status);
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
  };

  const {
    loading,
    data: updatedStatus,
    fn: updateStatus,
  } = useFetch(updateSprintStatus);

  const handleStatusChange = async (newStatus) => {
    updateStatus(sprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
      toast.success("Sprint status updated successfully");
    }
  }, [updatedStatus, loading]);

  const getStatusText = () => {
    if (status === "COMPLETED") return "Sprint Ended";
    if (status === "ACTIVE" && isAfter(now, endDate))
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    if (status === "PLANNED" && isAfter(now, startDate))
      return `Starts in ${formatDistanceToNow(endDate)}`;
    return null;
  };

  return (
    <>
      <div className="flex justify-center items-center gap-4 ">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-500 self-start flex-1">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => {
              return (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name} ({format(sprint.startDate, "MMM d , yyyy")}) to{" "}
                  {format(sprint.endDate, "MMM d , yyyy")}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {canStart && (
          <Button
            className={"bg-green-900 text-white"}
            onClick={() => handleStatusChange("ACTIVE")}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            className={"bg-green-900 text-white"}
            variant={"destructive"}
            onClick={() => handleStatusChange("COMPLETED")}
          >
            End Sprint
          </Button>
        )}
      </div>

      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}
      {getStatusText() && (
        <Badge className={"mx-3 ml-1 self-start"}>{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
