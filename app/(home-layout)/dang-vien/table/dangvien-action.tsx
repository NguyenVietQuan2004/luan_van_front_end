"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/alert-modal";

import { DangVien } from "@/types/dangvien";
import { deleteDangVien } from "@/lib/api";

export default function DangVienAction({ data }: { data: DangVien }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  console.log(data);
  const onCopy = () => {
    navigator.clipboard.writeText(data._id!);
    toast("Đã copy ID");
  };

  const handleDelete = async () => {
    try {
      await deleteDangVien(data._id!);
      toast("Đã xóa thành công");
    } catch (err: any) {
      toast("Xóa thất bại");
    } finally {
      setOpen(false);
      window.location.reload();
    }
  };

  return (
    <>
      <AlertModal
        open={open}
        onClose={() => setOpen(false)}
        action="Xóa"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onCopy}>Copy ID</DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push(`/dang-vien/${data._id}/edit`)}>Sửa</DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
