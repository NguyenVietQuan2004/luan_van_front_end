"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteStep, fetchSteps } from "@/lib/step";
import { Step } from "@/lib/step";

export default function StepsPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSteps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSteps();
      setSteps(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSteps();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa bước này?")) return;
    try {
      await deleteStep(id);
      await loadSteps();
    } catch (err: any) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  useEffect(() => {
    console.log("ENV:", process.env.NEXT_PUBLIC_API_URL);
  }, []);
  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="container text-sm mx-auto p-6 bg-white border border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Quản lý các bước cảm tình Đảng</h1>
        <Link
          href="/steps/new/edit"
          className="text-[#515151] hover:bg-white/10 transition-all duration-300 border border-[#243f50] p-1.25 px-3 bg-[#F7F7F7] rounded"
        >
          + Thêm bước mới
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2">Thứ tự</th>
            <th className="border px-3 py-2">Tên bước</th>
            <th className="border px-3 py-2">File mẫu</th>
            <th className="border px-3 py-2">Ghi chú</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step._id}>
              <td className="border px-3 py-2 text-center">{step.step_order}</td>
              <td className="border px-3 py-2">{step.name}</td>
              <td className="border px-3 py-2">
                {step.template_file ? (
                  <a
                    href={`http://localhost:5000${step.template_file}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Xem file
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-3 py-2">{step.note || "-"}</td>
              <td className="border px-3 py-2 text-center">
                <div className="flex gap-3 justify-center">
                  <Link href={`/steps/${step._id}/edit`} className="text-blue-600 hover:underline">
                    Sửa
                  </Link>
                  <button onClick={() => handleDelete(step._id)} className="text-red-600 hover:underline">
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {steps.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Chưa có bước nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
