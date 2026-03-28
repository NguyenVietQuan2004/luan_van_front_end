"use client";

import { useState, useEffect } from "react";
import { CuocthiColumns } from "./table/cuocthi-columns";
import { DataTable } from "@/components/data-table";
import { fetchCuocthiList, deleteCuocthi } from "@/lib/contest"; // tạo hàm api tương tự
import ButtonAddNew from "@/components/ButtonAdd";

export default function CuocthiPage() {
  const [cuocthis, setCuocthis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCuocthis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCuocthiList();
      setCuocthis(data);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách cuộc thi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCuocthis();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa cuộc thi này?")) return;
    try {
      const data = await deleteCuocthi(id);
      await loadCuocthis();
    } catch (err: any) {
      alert("Xóa thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  if (loading) {
    return (
      <div className=" mx-auto p-6 text-center">
        <p className="text-lg">Đang tải danh sách cuộc thi...</p>
      </div>
    );
  }

  return (
    <div className="text-sm mx-auto p-6 bg-white  border-[#ccc] rounded-[5px]">
      <div className="flex flex-row justify-between items-start mb-6">
        <ButtonAddNew className="" href="/cuoc-thi/new/edit">
          Thêm mới cuộc thi
        </ButtonAddNew>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-[#3872b2] text-[13px] w-1/2 leading-relaxed mb-6">
        <p>
          Trang quản lý danh sách cuộc thi. Hỗ trợ thêm/sửa/xóa thông tin cuộc thi, theo dõi thời gian đăng ký, thời
          gian diễn ra, địa điểm, loại hình và quy định cuộc thi.
        </p>
      </div>

      <DataTable
        columns={CuocthiColumns(handleDelete)}
        data={cuocthis}
        filterField="name"
        tableName="Danh sách Cuộc thi"
      />
    </div>
  );
}
