"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CuocthidangkyAction from "./cuocthidangky-action";

export const CuocthidangkyColumns = (onDelete: (id: string) => void): ColumnDef<any>[] => [
  {
    accessorKey: "contest_id.name",
    header: ({ column }) => (
      <Button
        className="font-bold! text-[13px] text-[#232934]! hover:bg-transparent   p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tên cuộc thi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "team_name",
    header: "Tên đội / Nhóm",
    cell: ({ row }) => row.original.team_name || "Cá nhân",
  },
  {
    accessorKey: "members",
    header: "Số thành viên",
    cell: ({ row }) => row.original.members?.length || 0,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const colors = {
        registered: "text-yellow-600",
        approved: "text-green-600",
        rejected: "text-red-600",
        completed: "text-[#3872b2]",
      } as any;
      return <span className={colors[status] || ""}>{status}</span>;
    },
  },
  {
    accessorKey: "register_date",
    header: "Ngày đăng ký",
    cell: ({ row }) => new Date(row.original.register_date).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "result",
    header: "Kết quả",
    cell: ({ row }) => {
      const r = row.original.result;

      if (!r) return "-";

      return (
        r.title ||
        (r.rank !== undefined && r.rank !== null ? `Hạng ${r.rank}` : "") ||
        (r.score !== undefined && r.score !== null ? `Điểm ${r.score}` : "") ||
        "-"
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <CuocthidangkyAction data={row.original} onDelete={onDelete} />,
  },
];
