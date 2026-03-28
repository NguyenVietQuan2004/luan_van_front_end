// "use client";

// import { useState, useEffect, useMemo } from "react";
// import Link from "next/link";
// import * as XLSX from "xlsx";
// import { deleteReport, fetchReports, fetchReportTypes } from "@/lib/report";
// import ButtonAddNew from "@/components/ButtonAdd";
// import { Report } from "@/types/report";

// export default function ReportsPage() {
//   const [reports, setReports] = useState<Report[]>([]);
//   const [reportTypes, setReportTypes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [exporting, setExporting] = useState(false);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTypeId, setSelectedTypeId] = useState<string>(""); // "" = tất cả
//   const [selectedCodeId, setSelectedCodeId] = useState<string>("");

//   const loadData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [reportsData, typesData] = await Promise.all([fetchReports(), fetchReportTypes()]);
//       setReports(reportsData);
//       setReportTypes(typesData);
//     } catch (err: any) {
//       setError(err.message || "Lỗi tải dữ liệu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // ==================== LỌC THEO SEARCH + TYPE ====================
//   const filteredReports = useMemo(() => {
//     return reports.filter((r) => {
//       const matchesSearch =
//         !searchTerm.trim() ||
//         (r.code_id?.name || "").toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
//         (r.title || "").toLowerCase().includes(searchTerm.toLowerCase().trim());

//       const matchesType = !selectedTypeId || r.code_id?.type_id?._id === selectedTypeId;

//       return matchesSearch && matchesType;
//     });
//   }, [reports, searchTerm, selectedTypeId]);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Xác nhận xóa báo cáo này?")) return;
//     try {
//       await deleteReport(id);
//       await loadData(); // reload sau khi xóa
//     } catch (err: any) {
//       alert("Xóa thất bại: " + err.message);
//     }
//   };

//   // ==================== XUẤT EXCEL ====================
//   const exportToExcel = () => {
//     if (filteredReports.length === 0) {
//       alert("Không có dữ liệu để xuất!");
//       return;
//     }

//     setExporting(true);

//     try {
//       const excelData = filteredReports.map((r) => ({
//         "Số hiệu": `${r.code_id?.code || ""}-${r.so}`,
//         "Loại văn bản": r.code_id?.type_id?.name || "",
//         "Mã báo cáo": r.code_id?.name || "",
//         "Tiêu đề": r.title || "",
//         "Ngày ban hành": r.ngay_ban_hanh ? new Date(r.ngay_ban_hanh).toLocaleDateString("vi-VN") : "",
//         "File đính kèm": r.file_name || "Không có",
//       }));

//       const ws = XLSX.utils.json_to_sheet(excelData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Danh sách Báo cáo");

//       XLSX.writeFile(wb, `Danh_sach_bao_cao_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     } catch (err) {
//       console.error(err);
//       alert("Xuất Excel thất bại!");
//     } finally {
//       setExporting(false);
//     }
//   };

//   if (loading) return <div className="p-6 text-center">Đang tải...</div>;

//   return (
//     <div className="text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold text-[#232934]">Quản lý Báo cáo - Văn bản</h1>

//         <div className="flex gap-3">
//           {/* <button
//             onClick={exportToExcel}
//             disabled={exporting || filteredReports.length === 0}
//             className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded flex items-center gap-2 disabled:opacity-60"
//           >
//             {exporting ? "Đang xuất..." : "Xuất Excel"}
//           </button> */}

//           <ButtonAddNew href="/reports/new/edit" className="text-white">
//             Thêm báo cáo mới
//           </ButtonAddNew>
//         </div>
//       </div>

//       {/* ==================== FILTER SECTION ==================== */}
//       <div className="mb-6 flex flex-wrap gap-4">
//         {/* Tìm kiếm theo text */}
//         <div className="relative flex-1 max-w-md">
//           <input
//             type="text"
//             placeholder="Tìm theo tiêu đề hoặc mã báo cáo..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-none text-sm"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         {/* Filter theo Loại báo cáo */}
//         <div className="min-w-60">
//           <select
//             value={selectedTypeId}
//             onChange={(e) => setSelectedTypeId(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
//           >
//             <option value="">-- Tất cả loại báo cáo --</option>
//             {reportTypes.map((type) => (
//               <option key={type._id} value={type._id}>
//                 {type.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Thông tin kết quả lọc */}
//       <p className="text-xs text-gray-500 mb-4">
//         {searchTerm || selectedTypeId
//           ? `Tìm thấy ${filteredReports.length} báo cáo`
//           : `Tổng số báo cáo: ${reports.length}`}
//       </p>

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <table className="w-full border-collapse border text-[13px]">
//         <thead>
//           <tr className="bg-[#e6edf5]">
//             <th className="border px-3 py-2">Số hiệu</th>
//             <th className="border px-3 py-2">Loại</th>
//             <th className="border px-3 py-2">Tiêu đề</th>
//             <th className="border px-3 py-2">Ngày ban hành</th>
//             <th className="border px-3 py-2">File</th>
//             <th className="border px-3 py-2">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredReports.map((r) => (
//             <tr key={r._id}>
//               <td className="border px-3 py-2 font-medium">
//                 {r.code_id?.code || ""}-{r.so}
//               </td>
//               <td className="border px-3 py-2">{r.code_id?.type_id?.name || "-"}</td>
//               <td className="border px-3 py-2">{r.title || "-"}</td>
//               <td className="border px-3 py-2">
//                 {r.ngay_ban_hanh ? new Date(r.ngay_ban_hanh).toLocaleDateString("vi-VN") : "-"}
//               </td>
//               <td className="border px-3 py-2 text-xs">
//                 {r.file_url ? (
//                   <a
//                     href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${r.file_url}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-[#3872b2] hover:underline"
//                   >
//                     📎 {r.file_name}
//                   </a>
//                 ) : (
//                   <span className="text-gray-400">Không có</span>
//                 )}
//               </td>
//               <td className="border px-3 py-2 text-center">
//                 <Link href={`/reports/${r._id}/edit`} className="text-blue-600 hover:underline mr-3">
//                   Sửa
//                 </Link>
//                 <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:underline">
//                   Xóa
//                 </button>
//               </td>
//             </tr>
//           ))}

//           {filteredReports.length === 0 && (
//             <tr>
//               <td colSpan={6} className="text-center py-8 text-gray-500">
//                 Không tìm thấy báo cáo nào phù hợp với điều kiện lọc
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { deleteReport, fetchReports, fetchReportTypes } from "@/lib/report";
import ButtonAddNew from "@/components/ButtonAdd";
import { Report } from "@/types/report";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTypes, setReportTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCodeName, setSelectedCodeName] = useState<string>(""); // filter theo code.name

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsData, typesData] = await Promise.all([fetchReports(), fetchReportTypes()]);
      setReports(reportsData);
      setReportTypes(typesData);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==================== LẤY DANH SÁCH CODE NAME ====================
  const reportCodeNames = useMemo(() => {
    const map = new Map();
    reports.forEach((r) => {
      if (r.code_id?.name) {
        map.set(r.code_id.name, r.code_id.name);
      }
    });
    return Array.from(map.values());
  }, [reports]);

  // ==================== LỌC THEO SEARCH + CODE.NAME ====================
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        !searchTerm.trim() ||
        (r.code_id?.name || "").toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (r.title || "").toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesCode = !selectedCodeName || r.code_id?.name === selectedCodeName;

      return matchesSearch && matchesCode;
    });
  }, [reports, searchTerm, selectedCodeName]);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa báo cáo này?")) return;
    try {
      await deleteReport(id);
      await loadData();
    } catch (err: any) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  // ==================== XUẤT EXCEL ====================
  const exportToExcel = () => {
    if (filteredReports.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    setExporting(true);

    try {
      const excelData = filteredReports.map((r) => ({
        "Số hiệu": `${r.code_id?.code || ""}-${r.so}`,
        "Loại văn bản": r.code_id?.type_id?.name || "",
        "Mã báo cáo": r.code_id?.name || "",
        "Tiêu đề": r.title || "",
        "Ngày ban hành": r.ngay_ban_hanh ? new Date(r.ngay_ban_hanh).toLocaleDateString("vi-VN") : "",
        "File đính kèm": r.file_name || "Không có",
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách Báo cáo");

      XLSX.writeFile(wb, `Danh_sach_bao_cao_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error(err);
      alert("Xuất Excel thất bại!");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#232934">Quản lý Báo cáo - Văn bản</h1>

        <div className="flex gap-3">
          {/* <button
            onClick={exportToExcel}
            disabled={exporting || filteredReports.length === 0}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded flex items-center gap-2 disabled:opacity-60"
          >
            {exporting ? "Đang xuất..." : "Xuất Excel"}
          </button> */}

          <ButtonAddNew href="/reports/new/edit" className="text-white">
            Thêm báo cáo mới
          </ButtonAddNew>
        </div>
      </div>

      {/* ==================== FILTER SECTION ==================== */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* SEARCH */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc mã báo cáo..."
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

        {/* FILTER THEO CODE.NAME */}
        <div className="min-w-60">
          <select
            value={selectedCodeName}
            onChange={(e) => setSelectedCodeName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
          >
            <option value="">-- Tất cả mã báo cáo --</option>

            {reportCodeNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* THÔNG TIN */}
      <p className="text-xs text-gray-500 mb-4">
        {searchTerm || selectedCodeName
          ? `Tìm thấy ${filteredReports.length} báo cáo`
          : `Tổng số báo cáo: ${reports.length}`}
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2">Số hiệu</th>
            <th className="border px-3 py-2">Loại</th>
            <th className="border px-3 py-2">Tiêu đề</th>
            <th className="border px-3 py-2">Ngày ban hành</th>
            <th className="border px-3 py-2">File</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredReports.map((r) => (
            <tr key={r._id}>
              <td className="border px-3 py-2 font-medium">
                {r.code_id?.code || ""}-{r.so}
              </td>

              <td className="border px-3 py-2">{r.code_id?.type_id?.name || "-"}</td>

              <td className="border px-3 py-2">{r.title || "-"}</td>

              <td className="border px-3 py-2">
                {r.ngay_ban_hanh ? new Date(r.ngay_ban_hanh).toLocaleDateString("vi-VN") : "-"}
              </td>

              <td className="border px-3 py-2 text-xs">
                {r.file_url ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${r.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3872b2] hover:underline"
                  >
                    📎 {r.file_name}
                  </a>
                ) : (
                  <span className="text-gray-400">Không có</span>
                )}
              </td>

              <td className="border px-3 py-2 text-center">
                <Link href={`/reports/${r._id}/edit`} className="text-blue-600 hover:underline mr-3">
                  Sửa
                </Link>

                <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:underline">
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {filteredReports.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                Không tìm thấy báo cáo nào phù hợp với điều kiện lọc
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
