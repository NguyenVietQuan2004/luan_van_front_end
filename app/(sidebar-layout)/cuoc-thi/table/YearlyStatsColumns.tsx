"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const MemberParticipationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "so_tt",
    header: "STT",
  },
  {
    accessorKey: "ho_ten",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Họ tên Đảng viên
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "contest_name",
    header: "Tên cuộc thi",
  },
  {
    accessorKey: "register_date",
    header: "Ngày đăng ký",
    cell: ({ row }) => new Date(row.original.register_date).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "month",
    header: "Tháng",
  },
  {
    accessorKey: "year",
    header: "Năm",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === "completed"
          ? "text-green-600"
          : status === "approved"
            ? "text-blue-600"
            : status === "rejected"
              ? "text-red-600"
              : "text-gray-600";
      return <span className={`font-medium ${color}`}>{status}</span>;
    },
  },
  {
    accessorKey: "result_title",
    header: "Kết quả",
    cell: ({ row }) => row.original.result_title || "-",
  },
  {
    accessorKey: "result_rank",
    header: "Hạng",
    cell: ({ row }) => (row.original.result_rank ? `Hạng ${row.original.result_rank}` : "-"),
  },
];
