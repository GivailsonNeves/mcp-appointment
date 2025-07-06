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
import { listPatients } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const Selector = ({
    patient,
    onChange,
}: {
    patient?: string;
    onChange?: (doctor: string) => void;
}) => {
  
    const { data, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: listPatients,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return (
    <Select value={patient} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a patient" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Patient</SelectLabel>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            data?.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
