"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { deleteApplicant, fetchApplicants } from "@/lib/applicant";
import { Applicant } from "@/lib/applicant";
import ButtonAddNew from "@/components/ButtonAdd";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // State cho ô filter theo tên
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    loadApplicants();
  }, []);

  // ==================== LỌC THEO TÊN ====================
  const filteredApplicants = useMemo(() => {
    if (!searchTerm.trim()) return applicants;

    const term = searchTerm.toLowerCase().trim();
    return applicants.filter((app) => {
      const hoTen = app.dang_vien_id?.ho_ten || "";
      return hoTen.toLowerCase().includes(term);
    });
  }, [applicants, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa hồ sơ này?")) return;
    try {
      await deleteApplicant(id);
      await loadApplicants();
    } catch (err: any) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  // ==================== XUẤT EXCEL (dùng dữ liệu đã lọc) ====================
  const exportToExcel = () => {
    if (filteredApplicants.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    setExporting(true);

    try {
      const excelData: any[] = [];

      filteredApplicants.forEach((app) => {
        const hoTen = app.dang_vien_id?.ho_ten || "Không có tên";

        if (app.steps.length === 0) {
          excelData.push({
            "Họ tên": hoTen,
            "Thứ tự bước": "",
            "Tên bước": "Chưa có bước nào",
            "Trạng thái": "",
            "Chi tiết": "",
          });
        } else {
          app.steps.forEach((step: any) => {
            let chiTiet = "";
            if (step.details && Object.keys(step.details).length > 0) {
              chiTiet = Object.entries(step.details)
                .map(([key, value]) => {
                  const val = !value
                    ? "-"
                    : typeof value === "string" && !isNaN(Date.parse(value))
                      ? new Date(value).toLocaleDateString("vi-VN")
                      : String(value);
                  return `${key}: ${val}`;
                })
                .join(" | ");
            }

            excelData.push({
              "Họ tên": hoTen,
              "Thứ tự bước": step.step_id?.step_order || "",
              "Tên bước": step.step_id?.name || "",
              "Trạng thái": step.completed ? "Hoàn thành" : "Chưa hoàn thành",
              "Chi tiết": chiTiet,
            });
          });
        }
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách Cảm tình Đảng");

      XLSX.writeFile(wb, `Danh_sach_cam_tinh_dang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error(err);
      alert("Xuất Excel thất bại!");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  console.log(filteredApplicants);
  return (
    <div className=" text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#232934]">Quản lý hồ sơ cảm tình Đảng</h1>

        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            disabled={exporting || filteredApplicants.length === 0}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded flex items-center gap-2 disabled:opacity-60"
          >
            {exporting ? "Đang xuất..." : "Xuất Excel"}
          </button>

          <ButtonAddNew href="/applicants/new/edit" className="text-white">
            Thêm hồ sơ mới
          </ButtonAddNew>
        </div>
      </div>

      {/* ==================== Ô TÌM KIẾM ==================== */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo họ tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-none text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        {/* {searchTerm && <p className="text-xs text-gray-500 mt-1">Tìm thấy {filteredApplicants.length} hồ sơ</p>} */}
        <p className="text-xs text-gray-500 mt-1"> {searchTerm && `Tìm thấy ${filteredApplicants.length} hồ sơ`}</p>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2">Họ tên</th>
            <th className="border px-3 py-2">Chi tiết các bước</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplicants.map((app) => {
            const completedCount = app.steps.filter((s: any) => s.completed).length;

            return (
              <tr key={app._id}>
                <td className="border px-3 py-2 font-medium text-blue-500 ">
                  {app.dang_vien_id?.ho_ten || "Không có tên"}
                </td>

                <td className="border px-3 py-2">
                  <div className="max-h-140 overflow-y-auto space-y-3 pr-2">
                    {app.steps.length === 0 ? (
                      <p className="text-gray-500 italic">Chưa có bước nào</p>
                    ) : (
                      app.steps.map((step: any, idx: number) => (
                        <div key={step._id || idx} className="border border-gray-200 rounded p-3 bg-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-[#3872b2]">Thứ tự {step.step_id?.step_order}.</span>
                            <span className="font-medium flex-1">{step.step_id?.name}</span>
                            {step.completed && (
                              <span className="text-green-600 text-xs font-medium px-2 py-0.5 bg-green-100 rounded">
                                ✓ Hoàn thành
                              </span>
                            )}
                          </div>

                          {step.details && Object.keys(step.details).length > 0 && (
                            <div className="mb-2 text-xs">
                              <div className="font-medium text-gray-700 mb-1">Chi tiết:</div>
                              <div className="grid grid-cols-1 gap-1">
                                {Object.entries(step.details).map(([key, value]) => (
                                  <div key={key} className="flex gap-2">
                                    <span className="text-gray-500 min-w-20">{key}:</span>
                                    <span className="font-medium">
                                      {!value
                                        ? "-"
                                        : typeof value === "string" && !isNaN(Date.parse(value))
                                          ? new Date(value).toLocaleDateString("vi-VN")
                                          : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {step.file_url && (
                            // <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            //   📎 Có file đính kèm:
                            //   <span className="underline">{step.file_name || "Xem file"}</span>
                            // </div>

                            <div className="flex  gap-1 text-xs ">
                              File đính kèm:
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${step.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#3872b2] hover:underline "
                              >
                                {step.file_name || "Xem file"}
                              </a>
                              {/* {step.uploaded_at && (
                                <span className="text-gray-500">
                                  {new Date(step.uploaded_at).toLocaleString("vi-VN")}
                                </span>
                              )} */}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </td>

                <td className="border px-3 py-2 text-center">
                  <Link href={`/applicants/${app._id}/steps`} className="text-green-600 hover:underline font-medium">
                    Quản lý bước
                  </Link>
                </td>
              </tr>
            );
          })}

          {filteredApplicants.length === 0 && !loading && (
            <tr>
              <td colSpan={3} className="text-center py-8 text-gray-500">
                {searchTerm ? "Không tìm thấy hồ sơ nào phù hợp" : "Chưa có hồ sơ cảm tình Đảng nào"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
