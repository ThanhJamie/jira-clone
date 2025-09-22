"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";
import "react-day-picker/dist/style.css";

import { sprintSchema } from "@/app/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprints";
export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}) {
  const [showForm, setShowForm] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn } = useFetch(
    createSprint,
    { successMessage: "Sprint created successfully!" }
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const onSubmit = async (data) => {
    const result = await createSprintFn(projectId, {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });

    // Only close form and refresh if successful (no error thrown)
    if (result !== undefined) {
      setShowForm(false);
      router.refresh(); // Refresh the page to show updated data
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-slate-950"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-start text-left font-normal bg-slate-950 hover:bg-slate-800 ${
                          !dateRange && "text-muted-foreground"
                        }`}
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from && dateRange.to ? (
                          format(dateRange.from, "LLL dd, y") +
                          " - " +
                          format(dateRange.to, "LLL dd, y")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                      {isCalendarOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 p-4 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-50"
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            marginTop: "8px",
                            zIndex: 9999,
                            backgroundColor: "rgb(15 23 42)",
                            border: "1px solid rgb(51 65 85)",
                            borderRadius: "8px",
                            padding: "16px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <DayPicker
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => {
                              if (range?.from) {
                                const newRange = {
                                  from: range.from,
                                  to: range.to || range.from,
                                };
                                setDateRange(newRange);
                                field.onChange(newRange);
                              }
                            }}
                            disabled={[{ before: new Date() }]}
                            className="bg-slate-900 text-white"
                            modifiersClassNames={{
                              selected: "bg-blue-600 text-white",
                              range_start: "bg-blue-700",
                              range_end: "bg-blue-700",
                              range_middle: "bg-blue-400",
                              today: "border-2 border-blue-700",
                            }}
                          />
                          <div className="mt-2 flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsCalendarOpen(false)}
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
