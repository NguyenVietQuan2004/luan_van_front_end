"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CuocthiAction from "./cuocthi-action";

export const CuocthiColumns = (onDelete: (id: string) => void): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tên cuộc thi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại hình",
    cell: ({ row }) => (row.original.type === "online" ? "Trực tuyến" : "Trực tiếp"),
  },
  {
    accessorKey: "start_date",
    header: "Bắt đầu",
    cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "end_date",
    header: "Kết thúc",
    cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "registration_deadline",
    header: "Hạn đăng ký",
    cell: ({ row }) => new Date(row.original.registration_deadline).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "max_members",
    header: "Số lượng tối đa",
  },
  {
    accessorKey: "location",
    header: "Địa điểm",
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <CuocthiAction data={row.original} onDelete={onDelete} />,
  },
];
