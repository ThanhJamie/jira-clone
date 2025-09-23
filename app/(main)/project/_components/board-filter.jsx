"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const BoardFilter = ({ issues, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const assignees = issues
    .map((issue) => issue.assignee)
    .filter((assignee) => assignee !== null && assignee !== undefined)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t?.id === item?.id)
    );

  const isFilterApplied =
    searchTerm !== "" ||
    selectedAssignee?.length > 0 ||
    selectedPriority !== "";

  const clearFilter = () => {
    setSearchTerm("");
    setSelectedAssignee([]);
    setSelectedPriority("");
  };

  useEffect(() => {
    const filteredIssues = issues.filter((issue) => {
      return (
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignee.length === 0 ||
          selectedAssignee.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority)
      );
    });
    onFilterChange(filteredIssues);
  }, [searchTerm, selectedAssignee, selectedPriority, issues]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignee((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        <Input
          className={"w-full sm:w-72"}
          placeholder="Search issues...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
              const selected = selectedAssignee.includes(assignee.id);
              return (
                <div
                  key={assignee.id}
                  className={`rounded-full cursor-pointer transition-all duration-200 ${
                    selected
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "ring-0 hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                  } ${i > 0 ? "-ml-6" : ""}`}
                  style={{
                    zIndex: i,
                  }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className={"h-10 w-10"}>
                    <AvatarImage
                      src={assignee?.imageUrl}
                      alt={assignee?.name}
                    />
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFilterApplied && (
          <Button
            variant={"ghost"}
            onClick={clearFilter}
            className={"flex items-center"}
          >
            <X className="h-4 w-4" /> Clear Filter
          </Button>
        )}
      </div>
    </div>
  );
};

export default BoardFilter;
