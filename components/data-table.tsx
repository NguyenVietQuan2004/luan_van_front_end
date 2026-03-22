"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterField: string;
  tableName?: string;
  meta?: any;
}
import { Button } from "@/components/ui/button";
export function DataTable<TData, TValue>({
  columns,
  data,
  filterField,
  tableName,
  meta,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta,
  });

  return (
    // <div className="max-w-287.5 overflow-auto  ">
    <div className="max-w-300 overflow-auto  ">
      <div className="flex items-center py-4 ">
        <Input
          placeholder={`Lọc theo ${filterField}...`}
          value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(filterField)?.setFilterValue(event.target.value)}
          className="max-w-sm bg-white rounded-none ring-0!"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto rounded-none">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md   font-light bg-white">
        {/* {tableName && <div>{tableName}</div>} */}

        <div className="w-full mb-px bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {tableName}
        </div>

        <Table className="border border-[#80B5D7] aaaaaaaaa">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=" border border-[#80B5D7] bg-[#DAE9F3] ">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="min-w-25! border border-[#80B5D7] font-bold! text-black! " key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`     ${index % 2 === 0 ? "bg-[#edf4f9]" : "bg-[#f7f7f7]"}  `}
                >
                  {row.getVisibleCells().map((cell, index1) => (
                    <TableCell
                      className={`  border-gray-200 ${index1 == 0 && "bg-[#dae9f3] border-[#80B5D7]"}   border max-w-50  overflow-hidden text-ellipsis whitespace-nowrap `}
                      key={cell.id}
                    >
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        {Array.from({ length: table.getPageCount() }, (_, i) => (
          <Button
            key={i}
            variant={table.getState().pagination.pageIndex === i ? "default" : "outline"}
            size="sm"
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </Button>
        ))}

        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
