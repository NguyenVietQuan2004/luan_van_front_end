"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import DangVienAction from "./dangvien-action";
import { DangVien } from "@/types/dangvien";

export const DangVienColumns: ColumnDef<DangVien>[] = [
  {
    accessorKey: "so_tt",
    header: "STT",
  },

  {
    accessorKey: "ho_ten",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Họ tên
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "ngay_sinh",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const date = row.original.ngay_sinh;
      return date ? new Date(date).toLocaleDateString("vi-VN") : "-";
    },
  },

  {
    accessorKey: "gioi_tinh",
    header: "Giới tính",
  },

  {
    accessorKey: "que_quan",
    header: "Quê quán",
  },

  {
    accessorKey: "ngay_vao_dang",
    header: "Ngày vào Đảng",
    cell: ({ row }) => {
      const date = row.original.ngay_vao_dang;
      return date ? new Date(date).toLocaleDateString("vi-VN") : "-";
    },
  },

  {
    accessorKey: "tinh_trang_huu_tri",
    header: "Hưu trí",
  },

  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <DangVienAction data={row.original} />,
  },
];
