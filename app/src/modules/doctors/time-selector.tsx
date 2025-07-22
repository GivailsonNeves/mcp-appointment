"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listAvailability, listDoctors } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const TimeSelector = ({
  time,
  date,
  doctorId,
  onChange,
}: {
  time?: string;
  date?: string;
  doctorId?: string;
  onChange?: (time: string) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["timers", doctorId],
    //@ts-ignore
    queryFn: () => listAvailability({ doctorId, date: new Date(date) }),
    refetchOnWindowFocus: false,
    enabled: !!doctorId && !!date,
    retry: 3,
  });

  return (
    <Select
      value={time}
      onValueChange={onChange}
      disabled={isLoading || !doctorId || !date}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a time" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time</SelectLabel>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            <>
              {time && !data?.includes(time) && <SelectItem key={time} value={time}>
                {time}
              </SelectItem>}
              {data?.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
