"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DangPhi } from "@/types/dangphi";
import DangPhiAction from "./dangphi-action";

const isMienDangPhi = (row: any): boolean => {
  const mienList = row.dangvien_phi_id?.mien_dang_phi || [];
  if (mienList.length === 0) return false;
  const recordMonth = row.thang; // 1 - 12
  const recordYear = row.nam;

  return mienList.some((m: any) => {
    if (!m.tu_ngay) return false;

    const from = new Date(m.tu_ngay);
    const to = m.den_ngay ? new Date(m.den_ngay) : new Date(8640000000000000);

    const fromYear = from.getFullYear();
    const fromMonth = from.getMonth() + 1; // chuyển sang 1-12
    const toYear = to.getFullYear();
    const toMonth = to.getMonth() + 1; // chuyển sang 1-12
    const startOK = recordYear > fromYear || (recordYear === fromYear && recordMonth >= fromMonth);
    const endOK = recordYear < toYear || (recordYear === toYear && recordMonth <= toMonth);

    return startOK && endOK;
  });
};
export const DangPhiColumns: ColumnDef<DangPhi>[] = [
  {
    id: "ho_ten",
    accessorKey: "dangvien_phi_id.dang_vien_id.ho_ten",
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
    id: "duoc_mien",
    header: "Được miễn tháng hiện tại",
    cell: ({ row }) => {
      const mien = isMienDangPhi(row.original);
      return <span className={`font-medium ${mien ? "text-red-600" : "text-gray-500"}`}>{mien ? "X" : "-"}</span>;
    },
  },

  {
    id: "thoiGian",
    header: "Thời gian",
    accessorFn: (row) => `${row.thang.toString().padStart(2, "0")}/${row.nam}`,
    cell: ({ row }) => `${row.original.thang.toString().padStart(2, "0")}/${row.original.nam}`,
    filterFn: (row, id, value) => {
      const thoiGian = `${row.original.thang.toString().padStart(2, "0")}/${row.original.nam}`;
      return thoiGian.includes(value);
    },
    enableSorting: true,
  },

  {
    accessorKey: "thu_nhap",
    header: "Thu nhập",
    cell: ({ row }) => {
      const mien = isMienDangPhi(row.original);
      return mien ? "" : row.original.thu_nhap?.toLocaleString("vi-VN") || "0";
    },
  },
  {
    accessorKey: "dang_phi",
    header: "Đảng phí",
    cell: ({ row }) => {
      const mien = isMienDangPhi(row.original);
      return mien ? "" : row.original.dang_phi?.toLocaleString("vi-VN") || "0";
    },
  },
  {
    accessorKey: "truy_thu",
    header: "Truy thu",
    cell: ({ row }) => {
      const mien = isMienDangPhi(row.original);
      return mien ? "" : row.original.truy_thu?.toLocaleString("vi-VN") || "0";
    },
  },
  {
    accessorKey: "tong_dang_phi",
    header: "Tổng đảng phí",
    cell: ({ row }) => {
      const mien = isMienDangPhi(row.original);
      const value = mien ? 0 : row.original.tong_dang_phi || 0;
      return Math.round(value).toLocaleString("vi-VN");
    },
  },
  {
    accessorKey: "da_thu",
    header: "Đã thu",
    cell: ({ row }) => {
      const mien = isMienDangPhi(row.original);
      const value = mien ? 0 : row.original.da_thu || 0;
      return value.toLocaleString("vi-VN");
    },
  },

  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <DangPhiAction data={row.original} />,
  },
];
