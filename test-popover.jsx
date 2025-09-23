"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TestPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <h1>Test Popover</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline">
            Click to open popover
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white text-black p-4">
          <p>This is a test popover content!</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
