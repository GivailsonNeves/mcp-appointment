"use client";
import { TableActions, TableActionsProps } from "@/ui/table-actions";
import { ColumnDef } from "@tanstack/react-table";

const useColumns = (props: TableActionsProps<any>) => {
  return [
    {
      id: "doctor name",
      header: "Doctor",
      accessorKey: "doctor.name",
    },
    {
      id: "patient name",
      header: "Patient",
      accessorKey: "patient.name",
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
    },
    {
      id: "time",
      header: "Time",
      accessorKey: "time",
    },
    {
      id: "assistant",
      header: "Criado por IA",
      accessorKey: "assistant",
      cell: ({ getValue }) => {
        const value = getValue() as boolean;
        return value ? "Sim" : "Não";
      },
    },
    {
      id: "actions",
      header: "",
      cell: (data) => {
        return (
          <TableActions data={data.row.original} {...props}>
            {/* {data.row.original.assistant && <Button
              variant="secondary"
              size="icon"
              onClick={() => {}}
            >
              <CheckIcon />
            </Button>} */}
          </TableActions>
        );
      },
    },
  ] as ColumnDef<any, unknown>[];
};

export default useColumns;
