"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CuocthidangkyColumns } from "./table/cuocthidangky-columns";
import { DataTable } from "@/components/data-table";
import { fetchCuocthidangkyList, deleteCuocthidangky } from "@/lib/dang-ky";

export default function CuocthidangkyPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCuocthidangkyList();
      setRegistrations(data);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa đăng ký này?")) return;
    try {
      await deleteCuocthidangky(id);
      await loadRegistrations();
    } catch (err: any) {
      alert("Xóa thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg">Đang tải danh sách đăng ký cuộc thi...</p>
      </div>
    );
  }

  return (
    <div className="text-sm mx-auto p-6 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <div className="flex flex-row justify-between items-start mb-6">
        <Link
          href="/cuocthi-dangky/new/edit"
          className="text-[#515151] hover:bg-white/10 transition-all duration-300 border border-[#243f50] p-1.25 px-2 bg-[#F7F7F7]"
        >
          Đăng ký mới
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-[#008000] text-[13px] w-1/2 leading-relaxed mb-6">
        <p>
          Trang quản lý danh sách đăng ký tham gia cuộc thi của đảng viên. Hỗ trợ thêm/sửa/xóa đăng ký, theo dõi thành
          viên, trạng thái duyệt, kết quả thi và chứng nhận.
        </p>
      </div>

      <DataTable
        columns={CuocthidangkyColumns(handleDelete)}
        data={registrations}
        filterField="team_name"
        tableName="Danh sách Đăng ký Cuộc thi"
      />
    </div>
  );
}
