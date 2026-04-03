"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchReportTypes, deleteReportType } from "@/lib/report";
import ButtonAddNew from "@/components/ButtonAdd";

export default function ReportTypesPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const data = await fetchReportTypes();
      setTypes(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa loại báo cáo này?")) return;
    try {
      await deleteReportType(id);
      await loadTypes();
    } catch (err: any) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#232934]">Quản lý loại tài liệu</h1>
        <ButtonAddNew href="/reports/types/new/edit" className="text-white">
          Thêm loại mới
        </ButtonAddNew>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2">Tên loại tài liệu</th>
            <th className="border px-3 py-2 w-32">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={type._id}>
              <td className="border px-3 py-2 font-medium">{type.name}</td>
              <td className="border px-3 py-2 text-center">
                <Link href={`/reports/types/${type._id}/edit`} className="text-blue-600 hover:underline mr-4">
                  Sửa
                </Link>
                <button onClick={() => handleDelete(type._id)} className="text-red-600 hover:underline">
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {types.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-8 text-gray-500">
                Chưa có loại báo cáo nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
