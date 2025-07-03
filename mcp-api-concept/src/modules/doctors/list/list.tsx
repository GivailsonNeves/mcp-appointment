"use client";
import { DataTable } from "@/components/ui/data-table";
import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import { listDoctors } from "@/services";

export function List(props: Parameters<typeof useColumns>[0]) {
  const columns = useColumns(props);

  
  const { data, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: listDoctors,
    refetchOnWindowFocus: false,
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
