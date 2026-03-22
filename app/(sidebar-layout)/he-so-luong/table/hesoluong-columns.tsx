"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { HeSoLuong } from "@/types/hesoluong";
import HeSoLuongAction from "./hesoluong-action";

export const HeSoLuongColumns: ColumnDef<HeSoLuong>[] = [
  {
    accessorKey: "ma_ngach",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Mã ngạch
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "bac",
    header: "Bậc",
  },
  {
    accessorKey: "he_so_luong",
    header: "Hệ số lương",
    cell: ({ row }) => row.original.he_so_luong.toFixed(2),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <HeSoLuongAction data={row.original} />,
  },
];
