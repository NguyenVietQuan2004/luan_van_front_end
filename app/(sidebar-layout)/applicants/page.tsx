"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteApplicant, fetchApplicants } from "@/lib/applicant";
import { Applicant } from "@/lib/applicant";
import SidebarLayout from "@/components/layout/sidebar-layout";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApplicants();
      setApplicants(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  console.log(applicants);
  useEffect(() => {
    loadApplicants();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa hồ sơ này?")) return;
    try {
      await deleteApplicant(id);
      await loadApplicants();
    } catch (err: any) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="container text-sm mx-auto p-6 bg-white border border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Quản lý hồ sơ cảm tình Đảng</h1>
        <Link
          href="/applicants/new/edit"
          className="text-[#515151] hover:bg-white/10 transition-all duration-300 border border-[#243f50] p-1.25 px-3 bg-[#F7F7F7] rounded"
        >
          + Thêm hồ sơ mới
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2">Họ tên</th>
            <th className="border px-3 py-2">Ngày sinh</th>
            <th className="border px-3 py-2">Giới tính</th>
            <th className="border px-3 py-2">Số bước hoàn thành</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((app) => (
            <tr key={app._id}>
              <td className="border px-3 py-2">{app.name}</td>
              <td className="border px-3 py-2">{app.dob ? new Date(app.dob).toLocaleDateString("vi-VN") : "-"}</td>
              <td className="border px-3 py-2">{app.gender || "-"}</td>
              <td className="border px-3 py-2 text-center">
                {app.steps.filter((s: any) => s.completed).length} / {app.steps.length}
              </td>
              <td className="border px-3 py-2 text-center">
                <div className="flex gap-3 justify-center">
                  <Link href={`/applicants/${app._id}/edit`} className="text-blue-600 hover:underline">
                    Sửa
                  </Link>
                  <Link href={`/applicants/${app._id}/steps`} className="text-green-600 hover:underline">
                    Quản lý bước
                  </Link>
                  <button onClick={() => handleDelete(app._id)} className="text-red-600 hover:underline">
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {applicants.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Chưa có hồ sơ nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
