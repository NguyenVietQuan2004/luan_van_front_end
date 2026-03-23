"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteDangVien, fetchDangVienList } from "@/lib/api";
import { DangVien } from "@/types/dangvien";
import { DangVienColumns } from "./table/dangvien-columns";
import { DataTable } from "@/components/data-table";

export default function DangVienPage() {
  const [dangviens, setDangviens] = useState<DangVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm fetch danh sách (có thể gọi lại khi cần refresh)
  const loadDangViens = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDangVienList();
      setDangviens(data);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách đảng viên");
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu khi mount
  useEffect(() => {
    loadDangViens();
  }, []);

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa đảng viên này?")) return;

    try {
      await deleteDangVien(id);
      // Refresh danh sách sau khi xóa thành công
      await loadDangViens();
      // Hoặc dùng cách khác: setDangviens(prev => prev.filter(dv => dv._id !== id)) → optimistic update
    } catch (err: any) {
      alert("Xóa thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg">Đang tải danh sách đảng viên...</p>
      </div>
    );
  }

  return (
    <div className="text-sm mx-auto p-6 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <div className="flex flex-row  justify-between items-start mb-6">
        <Link
          href="/dang-vien/new/edit"
          className=" text-[#515151] hover:bg-white/10 transition-all duration-300 border  border-[#243f50] p-1.25 px-2 bg-[#F7F7F7]"
        >
          Thêm mới đảng viên
        </Link>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className=" text-[#3872b2] text-[13px] w-1/2 leading-relaxed">
        <p>
          Trang quản lý danh sách đảng viên Bộ môn Khoa học Máy tính. Hệ thống hỗ trợ thêm/sửa/xóa thông tin đảng viên,
          theo dõi ngày vào Đảng, tình trạng hưu trí và các thông tin liên quan.
        </p>
      </div>
      <div className="">
        <DataTable columns={DangVienColumns} data={dangviens} filterField="ho_ten" tableName={"Danh sách Đảng viên"} />
      </div>
    </div>
  );
}
