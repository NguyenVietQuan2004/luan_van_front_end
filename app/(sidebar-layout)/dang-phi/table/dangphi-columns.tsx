"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DangPhi } from "@/types/dangphi";
import DangPhiAction from "./dangphi-action";

export const DangPhiColumns: ColumnDef<DangPhi>[] = [
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <DangPhiAction data={row.original} />,
  },
  {
    id: "ho_ten",
    accessorKey: "dangvien_phi_id.dang_vien_id.ho_ten",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Họ tên đảng viên
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "thang",
    header: "Tháng",
  },
  {
    accessorKey: "nam",
    header: "Năm",
  },
  {
    accessorKey: "thu_nhap",
    header: "Thu nhập",
    cell: ({ row }) => row.original.thu_nhap.toLocaleString("vi-VN"),
  },
  {
    accessorKey: "dang_phi",
    header: "Đảng phí",
    cell: ({ row }) => row.original.dang_phi.toLocaleString("vi-VN"),
  },
  {
    accessorKey: "truy_thu",
    header: "Truy thu",
    cell: ({ row }) => row.original.truy_thu.toLocaleString("vi-VN"),
  },
  {
    accessorKey: "tong_dang_phi",
    header: "Tổng đảng phí",
    cell: ({ row }) => Math.round(row.original.tong_dang_phi).toLocaleString("vi-VN"),
  },

  {
    accessorKey: "da_thu",

    header: "Đã thu",
    cell: ({ row }) => row.original?.da_thu?.toLocaleString("vi-VN") || 0,
  },
];
