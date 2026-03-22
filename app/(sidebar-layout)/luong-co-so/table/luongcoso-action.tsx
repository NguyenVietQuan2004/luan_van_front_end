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

import { LuongCoSo } from "@/types/luongcoso";
import { deleteLuongCoSo } from "@/lib/luongcoso";

export default function LuongCoSoAction({ data }: { data: LuongCoSo }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isHienhanh = !data.ngay_ket_thuc;
  const onCopy = () => {
    navigator.clipboard.writeText(data._id!);
    toast("Đã copy ID");
  };

  const handleDelete = async () => {
    try {
      await deleteLuongCoSo(data._id!);
      toast.success("Xóa mức lương cơ sở thành công");
      window.location.reload();
    } catch (err: any) {
      toast.error("Xóa thất bại: " + (err.message || "Lỗi không xác định"));
    } finally {
      setOpen(false);
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
          {!isHienhanh && (
            <DropdownMenuItem onClick={() => router.push(`/luong-co-so/${data._id}/edit`)}>Sửa</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpen(true)}>Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
