"use client";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import UserAvatar from "./user-avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./issue-details-dialog";

const IssueCard = ({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const priorityColor = {
    LOW: "border-green-500",
    MEDIUM: "border-yellow-500",
    HIGH: "border-orange-500",
    URGENT: "border-red-500",
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params) => {
    router.refresh();
    onUpdate(...params);
  };

  return (
    <>
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow border-t-2 ${
          priorityColor[issue.priority]
        } rounded-lg`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>
      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
};

export default IssueCard;
