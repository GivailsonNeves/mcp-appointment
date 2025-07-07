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
import { listDoctors } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const Selector = ({
    doctor,
    onChange,
}: {
    doctor?: string;
    onChange?: (doctor: string) => void;
}) => {
  
    const { data, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: listDoctors,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return (
    <Select value={doctor} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a doctor" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Doctor</SelectLabel>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            data?.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
