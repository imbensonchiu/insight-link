"use client"
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"; 
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


/*
const data = [
  {
    id: 1,
    name: "Theme 1",
    definition: "Theme 1 definition",
    mentions: 10,
  },
  {
    id: 2,
    name: "Theme 2",
    definition: "Theme 2 definition",
    mentions: 20,
  },
];
*/

export default function DataTableThemes({data}) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Modify columns to make entire row clickable
  const columns = [
    {
        accessorKey: "theme_id",
        header: <div className="text-right w-4">ID</div>,
        cell: ({ row }) => (
          <div className="text-gray-500 text-right font-mono text-xs w-2">{row.getValue("theme_id")}</div>
        ),
    },
    {
      accessorKey: "theme_name",
      header: "Name",
      cell: ({ row }) => (
        <a href={`/themes/${row.getValue("theme_id")}`} className="max-w-80 line-clamp-3">{row.getValue("theme_name")}</a>
      ),
    },
    {
      accessorKey: "definition",
      header: "Definition",
      cell: ({ row }) => (
        <div className="w-90 text-xs line-clamp-3">{row.getValue("definition")}</div>
      ),
    },
    {
        accessorKey: "number_of_mentions",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=""
          >
            Mentions
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-center">{row.getValue("number_of_mentions")}</div>
        ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full p-2">
      <div className="flex justify-between py-4 pt-1">
        <Input
          placeholder="Search themes..."
          value={typeof table.getColumn("theme_name")?.getFilterValue() === "string" ? table.getColumn("theme_name")?.getFilterValue() : ""}
          onChange={(event) =>
            table.getColumn("theme_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-8"
        />
        <div className="space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8"
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8"
            >
                Next
            </Button> 
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => router.push(`/themes/${row.getValue("theme_id")}`)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
