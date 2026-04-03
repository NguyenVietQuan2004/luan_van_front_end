"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import LuongCoSoAction from "./luongcoso-action";
import { LuongCoSo } from "@/types/luongcoso";

export const LuongCoSoColumns: ColumnDef<LuongCoSo>[] = [
  {
    accessorKey: "ngay_bat_dau",
    header: ({ column }) => (
      <Button
        className="font-bold! text-[13px] text-[#232934]! hover:bg-transparent   p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ngày bắt đầu
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.ngay_bat_dau;
      return date ? new Date(date).toLocaleDateString("vi-VN") : "-";
    },
  },
  {
    accessorKey: "ngay_ket_thuc",
    header: "Ngày kết thúc",
    cell: ({ row }) => {
      const date = row.original.ngay_ket_thuc;
      return date ? new Date(date).toLocaleDateString("vi-VN") : "Hiện hành";
    },
  },
  {
    accessorKey: "luong_co_so",
    header: "Lương cơ sở (đồng)",
    cell: ({ row }) => row.original.luong_co_so.toLocaleString("vi-VN"),
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      return String(rowValue).includes(value);
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <LuongCoSoAction data={row.original} />,
  },
];
