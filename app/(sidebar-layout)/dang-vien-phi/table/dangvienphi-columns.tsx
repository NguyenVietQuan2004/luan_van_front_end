"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DangVienPhi } from "@/types/dangvienphi";
import DangVienPhiAction from "./dangvienphi-action";

export const DangVienPhiColumns: ColumnDef<DangVienPhi>[] = [
  {
    id: "ho_ten",
    accessorKey: "dang_vien_id.ho_ten",
    header: ({ column }) => (
      <Button
        className="font-bold! text-[13px] text-[#232934]! hover:bg-transparent   p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Họ tên đảng viên
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "ma_cb",
    header: "Mã cán bộ",
  },
  {
    accessorKey: "ma_cc",
    header: "Mã công chức",
  },
  {
    accessorKey: "ma_ngach",
    header: "Mã ngạch",
  },
  {
    accessorKey: "bac",
    header: "Bậc",
  },
  {
    accessorKey: "hs_pccv",
    header: "HS PCCV",
    cell: ({ row }) => row.original.hs_pccv.toFixed(2),
  },
  {
    accessorKey: "pc_tham_nien_nha_giao",
    header: "HS PCTN",
    cell: ({ row }) => row.original.pc_tham_nien_nha_giao.toFixed(2),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <DangVienPhiAction data={row.original} />,
  },
];
