import React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input } from "@/client/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { Badge } from "@/client/components/ui/badge";
import { api } from "@/utils/api";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/client/components/ui/button";

import { DataTablePagination } from "@/client/components/DataTablePagination";
import { DeviceCreation } from "./DeviceCreation";
import UponDeletion from "./UponDeletion";
import UponAssignment from "./UponAssignment";
import Link from "next/link";

export type Device = {
  id: number;
  title: string;
  patient: string;
  active: boolean;
  ownerId: string;
};

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Device ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return <div className="text-right font-medium">{id}</div>;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      const id: string = row.getValue("id");
      return (
        <Link href={`/devices/${id}`} className="text-center font-medium">
          {title}
        </Link>
      );
    },
  },
  {
    accessorKey: "patient",
    header: () => <div className="text-center">Assigned patient</div>,
    cell: ({ row }) => {
      const patient: string = row.getValue("patient");
      return <div className="text-center font-medium">{patient}</div>;
    },
  },
  {
    accessorKey: "active",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status: boolean = row.getValue("active");
      const formatted = status ? "Active" : "Inactive";
      const style = status ? "default" : "secondary";
      return (
        <div className="text-center">
          <Badge variant={style} className="text-md px-3 py-1">
            {formatted}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "ownerId",
    header: () => <div className="text-center">Belongs to</div>,
    cell: ({ row }) => {
      const ownerId: string = row.getValue("ownerId");
      return <div className="text-center font-medium">{ownerId}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const device = row.original;

      return (
        <div className="flex items-center justify-between">
          <UponAssignment device={device} />
          <UponDeletion device={device} />
        </div>
      );
    },
  },
];

export default function DataTable() {
  const { data } = api.device.getAll.useQuery();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data: data ?? [],
    //@ts-ignore
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by patient ID..."
          value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("patient")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DeviceCreation />
      </div>
      <div className="rounded-md border">
        <Table>
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
      <DataTablePagination table={table} />
    </div>
  );
}
