"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  pagination,
  isLoading,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const TableInnerHeader = () => (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );

  if (isLoading) {
    return (
      <Table>
        <TableInnerHeader />
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton className="h-4 bg-muted" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableInnerHeader />
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination &&
        table.getRowModel().rows?.length !== 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={cn("cursor-pointer", {
                    "opacity-25 pointer-events-none": pagination.page === 1,
                  })}
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                />
              </PaginationItem>
              <PaginationItem>
                {Array.from({ length: pagination.total }).map((_, index) => (
                  <PaginationLink
                    className={cn("cursor-pointer", {
                      "bg-muted": pagination.page === index + 1,
                    })}
                    key={index}
                    onClick={() => pagination.onPageChange(index + 1)}
                    data-state={pagination.page === index + 1 && "selected"}
                  >
                    {index + 1}
                  </PaginationLink>
                ))}
              </PaginationItem>
              {/* <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem> */}
              <PaginationItem>
                <PaginationNext
                  className={cn("cursor-pointer", {
                    "opacity-25 pointer-events-none":
                      pagination.page === pagination.total,
                  })}
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
    </div>
  );
}
