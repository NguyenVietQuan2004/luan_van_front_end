"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { syllabusApi } from "@/lib/syll";
import { Syllabus } from "@/types/syll";
import UploadZone from "@/components/UploadZone";

export default function SyllabusPage() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSyllabuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await syllabusApi.getAll();
      setSyllabuses(data);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách syllabus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSyllabuses();
  }, []);

  const handleDelete = async (id: string, originalName: string) => {
    if (!confirm(`Bạn chắc chắn muốn xóa syllabus "${originalName}"?`)) return;

    try {
      await syllabusApi.delete(id);
      await loadSyllabuses();
    } catch (err: any) {
      alert("Xóa thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Đang tải danh sách...</div>;
  }

  return (
    <div className="text-sm mx-auto p-6 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-start mb-6">
        {/* <Link
          href="/syllabus/upload"
          className="bg-[#3872B2] text-white px-6 py-2 text-[13px] font-medium hover:bg-[#2f5f9e]"
        >
          + Tải file Word/PDF mới
        </Link> */}

        <UploadZone />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-[#3872b2] text-[13px] w-2/3 leading-relaxed mb-6">
        Trang quản lý Lý lịch. Hệ thống hỗ trợ upload file Word/PDF, extract tự động và lưu vào hệ thông.
      </div>

      <table className="w-full border-collapse border border-[#ccc] text-[13px]">
        <thead>
          <tr className="bg-[#EDF4F9] *:font-semibold">
            <th className="border border-[#ccc] px-3 py-2 text-left font-medium">Tên file gốc</th>
            <th className="border border-[#ccc] px-3 py-2 text-left font-medium">Địa chỉ</th>
            {/* <th className="border border-[#ccc] px-3 py-2 text-center font-medium">Số section</th> */}
            <th className="border border-[#ccc] px-3 py-2 text-center font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {syllabuses.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-500">
                Chưa có syllabus nào. Hãy tải file lên.
              </td>
            </tr>
          ) : (
            syllabuses.map((s) => {
              const sectionCount = Object.keys(s.sections || {}).length;
              // Lấy tên người từ section_1
              const personName = s.sections?.section_1?.content || s.originalName;
              const address = s.sections?.section_7?.content || s.originalName;

              return (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="border border-[#ccc] px-3 py-2">{personName}</td>
                  <td className="border border-[#ccc] px-3 py-2">{address}</td>
                  {/* <td className="border border-[#ccc] px-3 py-2 text-center">{sectionCount}</td> */}
                  <td className="border border-[#ccc] px-3 py-2 text-center">
                    <div className="flex gap-3 justify-center">
                      <Link href={`/trich-xuat/${s._id}/edit`} className="text-blue-600 hover:underline">
                        Chỉnh sửa
                      </Link>
                      <button onClick={() => handleDelete(s._id, personName)} className="text-red-600 hover:underline">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
