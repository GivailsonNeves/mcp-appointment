"use client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

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
            className="w-full font-normal border-0 rounded-md border-input"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "yyyy-MM-dd") : "Select date"}
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
