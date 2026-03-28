"use client";

import { useState, useEffect } from "react";
import { DangVienPhi } from "@/types/dangvienphi";
import { fetchDangVienPhiList } from "@/lib/dangvienphi";
import { DataTable } from "@/components/data-table";
import { DangVienPhiColumns } from "./table/dangvienphi-columns";
import ButtonAddNew from "@/components/ButtonAdd";

export default function DangVienPhiPage() {
  const [data, setData] = useState<DangVienPhi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className=" mx-auto p-6 text-center">
        <p className="text-lg">Đang tải danh sách đảng viên phí...</p>
      </div>
    );
  }
  return (
    <div className="text-sm mx-auto p-6 bg-white  border-[#ccc] rounded-[5px]">
      <div className="flex flex-row justify-between items-start mb-6">
        <ButtonAddNew className="" href="/dang-vien-phi/new/edit">
          Thêm mới thông tin đảng viên phí
        </ButtonAddNew>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-[#3872b2] text-[13px] w-1/2 leading-relaxed mb-6">
        <p>
          Trang quản lý thông tin lương, phụ cấp và miễn đảng phí của đảng viên. Mỗi đảng viên chỉ có một record duy
          nhất.
        </p>
      </div>

      <DataTable columns={DangVienPhiColumns} data={data} filterField="ho_ten" tableName="Danh sách Đảng viên phí" />
    </div>
  );
}
