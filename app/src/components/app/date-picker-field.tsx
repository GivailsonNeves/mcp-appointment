
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";
import React from "react";
import { cn } from "@/lib/utils";

type DatePickerFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: string;
  label?: string;
  placeholder?: string;
};

export function DatePickerField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Selecione uma data",
}: DatePickerFieldProps<T>) {
    const [open, setOpen] = React.useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, any> }) => (
        <FormItem className="flex flex-col">
          {label && <FormLabel>{label}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    field.value ? "text-black" : "text-muted-foreground",
                    "rounded-md w-full border-input flex items-center justify-start font-normal",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value
                    ? format(field.value, "yyyy-MM-dd")
                    : placeholder}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(e) => {
                  setOpen(false);
                  field.onChange(e);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
