import React from "react";
import {
  type ColumnDef,
  flexRender,
  type SortingState,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
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
import { api } from "@/utils/api";
import { ArrowUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { DataTablePagination } from "@/client/components/DataTablePagination";
import { RotatingLines } from "react-loader-spinner";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

export type Device = {
  id: number;
  logged_at: Date;
  temp: number;
  spo2: number;
  HP: number;
  deviceId: number;
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
            Log ID
            <ArrowUpDown />
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
    accessorKey: "logged_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Logged at
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const logged_at: string = row.getValue("logged_at");
      return (
        <div className="text-center font-medium">
          {new Date(logged_at).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "temp",
    header: () => <div className="text-center">Temperature</div>,
    cell: ({ row }) => {
      const temp: string = row.getValue("temp");
      return <div className="text-center font-medium">{temp}</div>;
    },
  },
  {
    accessorKey: "spo2",
    header: () => <div className="text-center">SpO2 Level</div>,
    cell: ({ row }) => {
      const spo2: string = row.getValue("spo2");
      return <div className="text-center font-medium">{spo2}</div>;
    },
  },
  {
    accessorKey: "HP",
    header: () => <div className="text-center">Heart Pressure</div>,
    cell: ({ row }) => {
      const HP: string = row.getValue("HP");
      return <div className="text-center font-medium">{HP}</div>;
    },
  },
  {
    accessorKey: "deviceId",
    header: () => <div className="text-center">Device ID</div>,
    cell: ({ row }) => {
      const deviceId: string = row.getValue("deviceId");
      return <div className="text-center font-medium">{deviceId}</div>;
    },
  },
];

export default function Logs({ deviceId = null }: { deviceId: string | null }) {
  const { data } = api.log.getByDevice.useQuery({ deviceId: deviceId });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [shouldRefresh, setShouldRefresh] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const deviceGetAllKey = getQueryKey(api.device.getAll, undefined, "query");
  const queryClient = useQueryClient();

  const table = useReactTable({
    data: data ?? [],
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
          placeholder="Filter by log ID..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("id")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <Button variant="secondary" className="ml-8">
          {shouldRefresh ? (
            <RotatingLines strokeColor="#422006" strokeWidth="5" width="20" />
          ) : (
            <div
              onClick={() => {
                setShouldRefresh((prev) => !prev);
                setTimeout(() => setShouldRefresh((prev) => !prev), 1000);
                void queryClient.invalidateQueries(deviceGetAllKey);
              }}
            >
              <RotateCcw size={20} />
            </div>
          )}
        </Button>
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
