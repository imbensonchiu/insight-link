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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash } from "lucide-react";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { set } from "date-fns";
import { neon } from '@neondatabase/serverless';


function MediaTypeBadge({ mediaType }) {
    if (mediaType === "mainstream"){
        return <Badge variant="secondary" className="bg-gray-200 text-xs font-normal">Mainstream</Badge>
    }else if (mediaType === "non-mainstream"){
        return <Badge variant="secondary" className="text-xs font-normal">Non-mainstream</Badge>
    }
}

export default function DataTable({ data }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteID, setDeleteID] = React.useState(null);

  const onDelete = (id) => {
    // Implement the delete functionality here
    console.log(`Deleting article with id: ${id}`);
    // You can add your API call or state update logic here
    setDeleteID(id);
  };

  React.useEffect(() => {
    if (deleteID !== null) {
      console.log("Delete ID: ", deleteID);
      const deleteArticle = async (id) => {
        try {
          const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
          const response = await sql`
              DELETE FROM public.articles WHERE id = ${id}
            `;
            console.log("DELETE Response:", response)
        } catch (error) {
          console.log("Delete article error: ", error);
        }
      };
      deleteArticle(deleteID);
    }
  }, [deleteID]);
  // Modify columns to make entire row clickable
  const columns = [
    {
        accessorKey: "id",
        header: <div className="text-right">ID</div>,
        cell: ({ row }) => (
          <div className="text-gray-500 text-right font-mono text-xs">{row.getValue("id")}</div>
        ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <a className="max-w-80" href={`/articles/${row.getValue("id")}`}>{row.getValue("title")}</a>
      ),
    },
    {
      accessorKey: "publisher",
      header: "Publisher",
      cell: ({ row }) => (
        <div>{row.getValue("publisher")}</div>
      ),
    },
    {
        accessorKey: "media_type",
        header: "Media Type",
        cell: ({ row }) => (
          <div><MediaTypeBadge mediaType={row.getValue("media_type")}></MediaTypeBadge></div>
        ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <div className="max-w-20 truncate ">{row.getValue("author")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        const formattedDate = new Intl.DateTimeFormat("en-CA").format(date);
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      header: "Delete",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger>
              <Trash size={16} className="text-gray-500 hover:text-gray-800"/>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the article.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              className="text-bold text-white"
              onClick={() => {
                onDelete(row.original.id);
                router.refresh();
              }}
            >
              Yes. I want to delete this article.
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          placeholder="Search articles..."
          value={typeof table.getColumn("title")?.getFilterValue() === "string" ? table.getColumn("title")?.getFilterValue() : ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
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
