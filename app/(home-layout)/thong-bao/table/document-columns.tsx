"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Document {
  _id: string;
  file_name: string;
  file_path: string;
  markdown: string | null;
  deadline: string | null;
  summary: string;
  uploaded_at: string;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("vi-VN", { dateStyle: "medium" }) : "—";

const formatDeadline = (dl: string | null) => (!dl || dl.toLowerCase() === "null" ? "Không có" : formatDate(dl));

// Action component
function DocumentActions({ doc, onViewDetail }: { doc: Document; onViewDetail?: (doc: Document) => void }) {
  const handleCopyId = () => {
    navigator.clipboard.writeText(doc._id);
    toast?.success("Đã copy ID") || alert("Đã copy ID");
  };
  const handleDelete = async () => {
    if (!confirm("Xác nhận xóa tài liệu này?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/documents/${doc._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());

      toast?.success("Xóa thành công") || alert("Xóa thành công");
      window.location.reload();
    } catch (err: any) {
      toast?.error("Xóa thất bại") || alert("Xóa thất bại: " + err.message);
    }
  };

  const handleNotify = async () => {
    if (!confirm(`Gửi thông báo cho tất cả đảng viên về tài liệu "${doc.file_name}"?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/documents/${doc._id}/notify`, {
        method: "POST",
      });

      if (!res.ok) throw new Error(await res.text());

      toast?.success("✅ Đã gửi thông báo thành công!") || alert("Đã gửi thông báo!");
    } catch (err: any) {
      toast?.error("Gửi thất bại: " + err.message) || alert("Gửi thất bại");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Mở menu hành động</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewDetail && onViewDetail(doc)} disabled={!onViewDetail}>
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNotify} className="text-emerald-600 focus:text-emerald-700">
          Gửi thông báo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-700 focus:bg-red-50">
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const DocumentColumns: ColumnDef<Document>[] = [
  {
    accessorKey: "file_name",
    header: ({ column }) => (
      <Button
        className="font-bold! text-[#232934]! hover:bg-transparent p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tên file
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const doc = row.original;

      return doc.file_path ? (
        <a
          href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${doc.file_path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline font-medium line-clamp-1 block max-w-xs"
        >
          {doc.file_name}
        </a>
      ) : (
        <span className="text-slate-600">{doc.file_name}</span>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => formatDeadline(row.original.deadline),
  },
  {
    accessorKey: "uploaded_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="font-bold! text-[#232934]! hover:bg-transparent p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Upload lúc
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.original.uploaded_at),
  },
  {
    accessorKey: "summary",
    header: "Tóm tắt",
    cell: ({ row }) => {
      const summary = row.original.summary;
      return summary ? (
        <span className="line-clamp-2 max-w-md text-sm text-slate-600">
          {summary.substring(0, 80)}
          {summary.length > 80 && "..."}
        </span>
      ) : (
        "—"
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onViewDetail?: (doc: Document) => void } | undefined;
      return <DocumentActions doc={row.original} onViewDetail={meta?.onViewDetail} />;
    },
  },
];
