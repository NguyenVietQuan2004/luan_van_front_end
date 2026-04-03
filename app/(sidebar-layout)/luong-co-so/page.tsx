"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuongCoSo } from "@/types/luongcoso";
import { fetchLuongCoSoList } from "@/lib/luongcoso";
import { DataTable } from "@/components/data-table";
import { LuongCoSoColumns } from "./table/luongcoso-columns";
import ButtonAddNew from "@/components/ButtonAdd";

export default function LuongCoSoPage() {
  const [data, setData] = useState<LuongCoSo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchLuongCoSoList();
      setData(list);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách lương cơ sở");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg">Đang tải danh sách lương cơ sở...</p>
      </div>
    );
  }

  return (
    <div className="text-sm mx-auto p-6 bg-white  border-[#ccc] rounded-[5px]">
      <div className="flex flex-row justify-between items-start mb-6">
        <ButtonAddNew className="" href="/luong-co-so/new/edit">
          Thêm mới mức lương cơ sở
        </ButtonAddNew>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-[#3872b2] text-[13px] w-1/2 leading-relaxed mb-6">
        <p>
          Trang quản lý lịch sử mức lương cơ sở theo thời gian. Mức hiện hành là dòng không có ngày kết thúc. Dữ liệu
          dùng để tính lương, đảng phí và các khoản liên quan.
        </p>
      </div>

      <DataTable
        columns={LuongCoSoColumns}
        data={data}
        filterField="luong_co_so"
        tableName="Danh sách Mức lương cơ sở"
      />
    </div>
  );
}
