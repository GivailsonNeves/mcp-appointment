"use client";
import { TableActions, TableActionsProps } from "@/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";

const useColumns = (props: TableActionsProps<any>) => {
  return [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },  
    {
      id: "nome",
      header: "Nome",
      accessorKey: "name",
    },  
    {
      id: "actions",
      header: "",
      cell: (data) => {
        return <TableActions data={data.row.original} {...props} />;
      },
    },
  ] as ColumnDef<any, unknown>[];
};

export default useColumns;
