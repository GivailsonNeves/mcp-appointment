"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

export const DateSelector = ({
  open,
  date,
  onChange,
  onOpenChange,
}: {
  open: boolean;
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal border-0"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              onOpenChange(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
