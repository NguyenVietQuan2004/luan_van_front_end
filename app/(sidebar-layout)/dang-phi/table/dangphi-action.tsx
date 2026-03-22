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

import { DangPhi } from "@/types/dangphi";
import { deleteDangPhi } from "@/lib/dangphi";

export default function DangPhiAction({ data }: { data: DangPhi }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onCopy = () => {
    navigator.clipboard.writeText(data._id!);
    toast("Đã copy ID");
  };

  const handleDelete = async () => {
    try {
      await deleteDangPhi(data._id!);
      toast.success("Xóa bản ghi đảng phí thành công");
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
          <DropdownMenuItem onClick={() => router.push(`/dang-phi/${data._id}/edit`)}>Sửa</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
