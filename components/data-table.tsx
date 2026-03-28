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
  filterField?: string;
  tableName?: string;
  meta?: any;
  tableKey?: string;
}
import { Button } from "@/components/ui/button";
import { useTableFilter } from "@/hooks/useTableFilter";
export function DataTable<TData, TValue>({
  columns,
  data,
  filterField,
  tableName = "default",
  tableKey,
  meta,
}: DataTableProps<TData, TValue>) {
  const filterStorageKey = tableKey || tableName;
  const { globalFilter, setGlobalFilter } = useTableFilter(filterStorageKey);

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
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter, // ← Kết nối với state
    globalFilterFn: "includesString", // hoặc "fuzzy" nếu có extension
    meta,
  });
  const columnLabels: Record<string, string> = {
    ho_ten: "họ tên",
    file_name: "tên file",
    team_name: "tên",
    ma_ngach: "mã ngạch",
    luong_co_so: "lương cơ sở",
    name: "tên",
    thang: "tháng",
    thoiGian: "thời gian",
  };
  return (
    // <div className="max-w-287.5 overflow-auto  ">
    <div className="w-full overflow-auto  ">
      <div className="flex items-center py-4 ">
        {/* {filterField && (
          <Input
            placeholder={`Lọc theo ${columnLabels[filterField]}...`}
            value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(filterField)?.setFilterValue(event.target.value)}
            className="max-w-xs  focus:border-[#3872b2]! bg-white ring-0! text-[13px] placeholder:text-[13px] border-[#254d79]  rounded-[5px] font-extralight! "
          />
        )} */}
        <div className="flex items-center py-4 gap-4">
          {filterField && (
            <Input
              placeholder={`Lọc theo ${columnLabels[filterField] || filterField}...`}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-xs ring-0! focus:border-[#3872b2] bg-white ring-0 text-[13px] placeholder:text-[13px] border-[#254d79] rounded-[5px]"
            />
          )}

          {globalFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlobalFilter("")}
              className="text-gray-500 p-1 hover:text-red-600"
            >
              Xóa lọc
            </Button>
          )}
        </div>
        {/* <DropdownMenu>
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
        </DropdownMenu> */}
      </div>
      <div className="rounded-md   font-light bg-white">
        {/* {tableName && <div>{tableName}</div>} */}

        <div
          className="w-full
         /* Layout & Text */
        relative px-6 
        inline-flex items-center justify-center
        overflow-hidden

        /* KỸ THUẬT: Tạo background dài gấp đôi chứa cả 2 dải màu */
        bg-[linear-gradient(to_right,#1E57A3,#2A85C9,#46A9E0,#2A85C9,#1E57A3)]
         bg-size-[200%_100%]
        bg-position-[0%_0%]

        /* Đổ bóng Glow từ ảnh gốc */
        
        /* HIỆU ỨNG VÀO: Di chuyển background thay vì đổi màu */
        transition-all duration-700 ease-in-out
        
        /* Khi Hover: Đẩy background sang phải 100% để hiện dải màu ngược */
        hover:bg-position-[100%_0%]
        hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]


        
        mb-px bg-linear-to-b from-[#418bdb] to-[#1047a4] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm"
        >
          {tableName}
        </div>

        <Table className="border border-[#80B5D7] text-[#232934]">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=" border border-[#80B5D7] bg-[#DAE9F3] ">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="min-w-25! border border-[#80B5D7] font-bold! text-[#232934]! "
                      key={header.id}
                    >
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
                      className={` py-0.5 border-gray-200 ${index1 == 0 && "bg-[#dae9f3] border-[#80B5D7]"}   border max-w-50  overflow-hidden text-ellipsis whitespace-nowrap `}
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
