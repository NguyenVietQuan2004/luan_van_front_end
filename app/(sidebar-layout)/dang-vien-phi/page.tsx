"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DangVienPhi } from "@/types/dangvienphi";
import { fetchDangVienPhiList } from "@/lib/dangvienphi";
import { DataTable } from "@/components/data-table";
import { DangVienPhiColumns } from "./table/dangvienphi-columns";

export default function DangVienPhiPage() {
  const [data, setData] = useState<DangVienPhi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(data);
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchDangVienPhiList();
      setData(list);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách đảng viên phí");
    } finally {
      setLoading(false);
    }
  };
  console.log(DangVienPhiColumns);
  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg">Đang tải danh sách đảng viên phí...</p>
      </div>
    );
  }
  return (
    <div className="container text-sm mx-auto p-6 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <div className="flex flex-row justify-between items-start mb-6">
        <Link
          href="/dang-vien-phi/new/edit"
          className="text-[#515151] hover:bg-white/10 transition-all duration-300 border border-[#243f50] p-1.25 px-2 bg-[#F7F7F7]"
        >
          Thêm mới thông tin đảng viên phí
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-[#008000] text-[13px] w-1/2 leading-relaxed mb-6">
        <p>
          Trang quản lý thông tin lương, phụ cấp và miễn đảng phí của đảng viên. Mỗi đảng viên chỉ có một record duy
          nhất.
        </p>
      </div>

      <DataTable columns={DangVienPhiColumns} data={data} filterField="ho_ten" tableName="Danh sách Đảng viên phí" />
    </div>
  );
}
