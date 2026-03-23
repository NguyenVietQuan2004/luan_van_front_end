"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DangPhi } from "@/types/dangphi";
import { fetchDangPhiList } from "@/lib/dangphi";
import { DataTable } from "@/components/data-table";
import { DangPhiColumns } from "./table/dangphi-columns";

export default function DangPhiPage() {
  const [data, setData] = useState<DangPhi[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchDangPhiList();
      setData(list);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách đảng phí");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleTinhDangPhiThangHienTai = async () => {
    if (!confirm("Bạn chắc chắn muốn tính đảng phí cho TẤT CẢ đảng viên trong tháng hiện tại?")) return;

    setCalculating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/dangphi/tinh-thang-hien-tai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Tính thất bại");
      }

      const result = await res.json();
      toast.success(
        `Tính thành công! Tạo mới: ${result.created} | Bỏ qua (đã có): ${result.skipped} | Tháng ${result.thang}/${result.nam}`,
      );

      if (result.errors?.length) {
        console.warn("Có lỗi:", result.errors);
        toast.warning("Có một số đảng viên bị lỗi khi tính, xem console để biết chi tiết");
      }

      loadData(); // refresh danh sách
    } catch (err: any) {
      toast.error("Tính đảng phí thất bại: " + (err.message || "Lỗi không xác định"));
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg">Đang tải danh sách đảng phí...</p>
      </div>
    );
  }

  return (
    <div className="text-sm mx-auto p-6 bg-white  border-[#ccc] rounded-[5px]">
      <div className="flex flex-row justify-between items-center mb-6">
        <div>
          <Link
            href="/dang-phi/new/edit"
            className="text-[#515151] hover:bg-white/10 rounded transition-all duration-300 border border-[#243f50] p-1.25 px-2 bg-[#F7F7F7] mr-4"
          >
            Thêm thủ công
          </Link>

          <button
            onClick={handleTinhDangPhiThangHienTai}
            disabled={calculating}
            className="bg-[#3872B2]  text-white p-1.25 px-2 rounded text-[13px] font-medium disabled:opacity-50"
          >
            {calculating ? "Đang tính cho tất cả..." : "Tính đảng phí tháng hiện tại"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-[#3872b2] text-[13px] w-1/2 leading-relaxed mb-6">
        <p>
          Trang quản lý đảng phí hàng tháng. Click nút "Tính đảng phí tháng hiện tại" để tự động tính và tạo bản ghi cho
          tất cả đảng viên. Tháng/năm hiện tại: {new Date().getMonth() + 1}/{new Date().getFullYear()}
        </p>
      </div>

      <DataTable columns={DangPhiColumns} data={data} filterField="ho_ten" tableName="Danh sách Đảng phí" />
    </div>
  );
}
