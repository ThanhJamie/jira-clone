"use client";
import React, { useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import statues from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./create-issue";
const SprintBoard = ({ sprints, projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const onDragEnd = () => {};
  const handleIssueCreated = () => {};

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };
  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 bg-slate-950 p-4 rounded-lg">
          {statues.map((column) => {
            return (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      <h3 className="font-semibold mb-2 text-center">
                        {column.name}
                      </h3>

                      {/* Issue */}
                      {provided.placeholder}
                      {column.key === "TODO" &&
                        currentSprint.status !== "COMPLETED" && (
                          <Button
                            variant={"ghost"}
                            className={"w-full"}
                            onClick={() => handleAddIssue(column.key)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Issue
                          </Button>
                        )}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        orgId={orgId}
        onIssueCreated={handleIssueCreated}
      />
    </div>
  );
};

export default SprintBoard;
