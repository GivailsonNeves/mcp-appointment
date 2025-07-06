"use client";
import { DataTable } from "@/components/ui/data-table";
import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import { listAppointments } from "@/services";

type Props = Parameters<typeof useColumns>[0] & {
  doctor: string | undefined;
  date: Date | undefined;
}

export function List({doctor, date, ...props}: Props) {
  const columns = useColumns(props);

  
  const { data, isLoading } = useQuery({
    queryKey: ["appointments", doctor, date],
    queryFn: () => listAppointments({ doctorId: doctor, date }),
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return (
    <DataTable
      isLoading={isLoading}
      columns={columns}
      data={data || []}
    />
  );
}
