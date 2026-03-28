// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { fetchReportCodes, deleteReportCode } from "@/lib/report";
// import ButtonAddNew from "@/components/ButtonAdd";

// export default function ReportCodesPage() {
//   const [codes, setCodes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadCodes = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchReportCodes();
//       setCodes(data);
//     } catch (err: any) {
//       setError(err.message || "Lỗi tải dữ liệu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCodes();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Xác nhận xóa mã báo cáo này?")) return;
//     try {
//       await deleteReportCode(id);
//       await loadCodes();
//     } catch (err: any) {
//       alert("Xóa thất bại: " + err.message);
//     }
//   };

//   if (loading) return <div className="p-6 text-center">Đang tải...</div>;

//   return (
//     <div className="text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold text-[#232934]">Quản lý Mã Báo cáo</h1>
//         <ButtonAddNew href="/reports/codes/new/edit" className="text-white">
//           Thêm mã mới
//         </ButtonAddNew>
//       </div>

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <table className="w-full border-collapse border text-[13px]">
//         <thead>
//           <tr className="bg-[#e6edf5]">
//             <th className="border px-3 py-2">Mã</th>
//             <th className="border px-3 py-2">Tên mã báo cáo</th>
//             <th className="border px-3 py-2">Loại</th>
//             <th className="border px-3 py-2 w-32">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {codes.map((code) => (
//             <tr key={code._id}>
//               <td className="border px-3 py-2 font-medium">{code.code}</td>
//               <td className="border px-3 py-2">{code.name}</td>
//               <td className="border px-3 py-2">{code.type_id?.name || "-"}</td>
//               <td className="border px-3 py-2 text-center">
//                 <Link href={`/reports/codes/${code._id}/edit`} className="text-blue-600 hover:underline mr-4">
//                   Sửa
//                 </Link>
//                 <button onClick={() => handleDelete(code._id)} className="text-red-600 hover:underline">
//                   Xóa
//                 </button>
//               </td>
//             </tr>
//           ))}

//           {codes.length === 0 && (
//             <tr>
//               <td colSpan={4} className="text-center py-8 text-gray-500">
//                 Chưa có mã báo cáo nào
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchReportCodes, deleteReportCode, fetchNextSo } from "@/lib/report";
import ButtonAddNew from "@/components/ButtonAdd";

export default function ReportCodesPage() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCodes = async () => {
    setLoading(true);
    try {
      const data = await fetchReportCodes();
      setCodes(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);
  console.log(codes);
  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa mã báo cáo này?")) return;
    try {
      await deleteReportCode(id);
      await loadCodes();
    } catch (err: any) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  // ==================== HÀM LẤY TEMPLATE ====================
  // const handleGetTemplate = async (code: any) => {
  //   if (!confirm(`Tạo template cho mã "${code.code} - ${code.name}"?`)) return;

  //   try {
  //     // Gọi API backend (bạn sẽ tạo endpoint này)
  //     // Giả sử endpoint trả về file DOCX trực tiếp
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/reports/codes?code_id=${code.code}&type_id=${code.type_id.name}`,
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       },
  //     );

  //     if (!response.ok) throw new Error("Không thể tạo template");

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     // Tên file đẹp: ví dụ BienBan_01_HĐND_2026.docx
  //     a.download = `Template_${code.code.replace(/\//g, "_")}_${new Date().getFullYear()}.docx`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);

  //     // alert("Đã tải template thành công!");
  //   } catch (err: any) {
  //     alert("Lấy template thất bại: " + err.message);
  //   }
  // };

  // ==================== HÀM LẤY TEMPLATE ====================
  const handleGetTemplate = async (code: any) => {
    if (!confirm(`Tạo template cho mã "${code.code} - ${code.name}"?`)) return;

    try {
      // Bước 1: Lấy số tiếp theo từ backend Node.js
      const nextData = await fetchNextSo(code._id);
      const nextSo = nextData.nextSo;

      // Bước 2: Gọi Python để tạo template (truyền cả so)
      const pythonUrl = `http://127.0.0.1:8000/api/reports/codes/template?code_id=${encodeURIComponent(code.code)}&type_id=${encodeURIComponent(code.type_id?.name || "BIÊN BẢN")}&so=${nextSo}`;

      const response = await fetch(pythonUrl);

      if (!response.ok) throw new Error("Không thể tạo file template");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Template_${code.code.replace(/\//g, "_")}_So${nextSo}_${new Date().getFullYear()}.docx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert("Lấy template thất bại: " + err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#232934]">Quản lý Mã Báo cáo</h1>
        <ButtonAddNew href="/reports/codes/new/edit" className="text-white">
          Thêm mã mới
        </ButtonAddNew>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2">Mã</th>
            <th className="border px-3 py-2">Tên mã báo cáo</th>
            <th className="border px-3 py-2">Loại</th>
            <th className="border px-3 py-2 w-48">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code._id}>
              <td className="border px-3 py-2 font-medium">{code.code}</td>
              <td className="border px-3 py-2">{code.name}</td>
              <td className="border px-3 py-2">{code.type_id?.name || "-"}</td>
              <td className="border px-3 py-2 text-center">
                {/* Nút Sửa */}
                <Link href={`/reports/codes/${code._id}/edit`} className="text-blue-600 hover:underline mr-4">
                  Sửa
                </Link>

                {/* === NÚT LẤY TEMPLATE MỚI THÊM === */}
                <button
                  onClick={() => handleGetTemplate(code)}
                  className="text-emerald-600 hover:underline mr-4 font-medium"
                >
                  Lấy template
                </button>

                {/* Nút Xóa */}
                <button onClick={() => handleDelete(code._id)} className="text-red-600 hover:underline">
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {codes.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-500">
                Chưa có mã báo cáo nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
