// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { syllabusApi } from "@/lib/syll";
// import { Syllabus } from "@/types/syll";

// export default function SyllabusEditPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
//   const [sections, setSections] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await syllabusApi.getById(id as string);
//         setSyllabus(data);
//         setSections(data.sections || {});
//       } catch (err) {
//         alert("Không tìm thấy syllabus");
//         router.push("/syllabus");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [id, router]);

//   // Cập nhật content (dạng text thường)
//   const updateContent = (key: string, value: string) => {
//     setSections((prev) => ({
//       ...prev,
//       [key]: { ...prev[key], content: value },
//     }));
//   };

//   // Cập nhật sub_fields
//   const updateSubField = (key: string, subKey: string, value: string) => {
//     setSections((prev) => ({
//       ...prev,
//       [key]: {
//         ...prev[key],
//         sub_fields: {
//           ...(prev[key]?.sub_fields || {}),
//           [subKey]: value,
//         },
//       },
//     }));
//   };

//   // Cập nhật một ô trong bảng (rows)
//   const updateRowField = (sectionKey: string, rowIndex: number, field: string, value: string) => {
//     setSections((prev) => {
//       const newRows = [...(prev[sectionKey].rows || [])];
//       newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
//       return {
//         ...prev,
//         [sectionKey]: { ...prev[sectionKey], rows: newRows },
//       };
//     });
//   };

//   // Thêm dòng mới vào bảng
//   const addNewRow = (sectionKey: string) => {
//     setSections((prev) => {
//       const currentRows = prev[sectionKey].rows || [];
//       // Lấy mẫu từ dòng đầu tiên nếu có, nếu không thì để rỗng
//       const template = currentRows[0] ? { ...currentRows[0] } : {};
//       Object.keys(template).forEach((k) => (template[k] = ""));

//       return {
//         ...prev,
//         [sectionKey]: {
//           ...prev[sectionKey],
//           rows: [...currentRows, template],
//         },
//       };
//     });
//   };

//   // Xóa dòng trong bảng
//   const removeRow = (sectionKey: string, rowIndex: number) => {
//     setSections((prev) => {
//       const newRows = [...(prev[sectionKey].rows || [])];
//       newRows.splice(rowIndex, 1);
//       return {
//         ...prev,
//         [sectionKey]: { ...prev[sectionKey], rows: newRows },
//       };
//     });
//   };

//   const handleSave = async () => {
//     if (!syllabus) return;
//     setSaving(true);
//     try {
//       await syllabusApi.update(syllabus._id, sections);
//       alert("Lưu thành công!");
//       router.push("/syllabus");
//     } catch (err: any) {
//       alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="p-6 text-center">Đang tải...</div>;

//   const inputClass = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
//   const labelClass = "bg-gray-100 font-medium px-2 py-1 border border-gray-400";
//   const tdClass = "border border-gray-400 px-2 py-2";

//   return (
//     <div className="container text-[13px] mx-auto p-4 bg-white  rounded-[5px]">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <div className="text-[#3872b2] font-medium text-lg">Chỉnh sửa hồ sơ</div>
//           <div className="text-xs">{syllabus?.originalName}</div>
//         </div>
//         <button onClick={() => router.push("/syllabus")} className="text-blue-600 hover:underline text-[13px]">
//           ← Quay lại danh sách
//         </button>
//       </div>

//       <div
//         className="w-full
//          /* Layout & Text */
//         relative px-6
//         inline-flex items-center justify-center
//         overflow-hidden

//         /* KỸ THUẬT: Tạo background dài gấp đôi chứa cả 2 dải màu */
//         bg-[linear-gradient(to_right,#1E57A3,#2A85C9,#46A9E0,#2A85C9,#1E57A3)]
//          bg-size-[200%_100%]
//         bg-position-[0%_0%]

//         /* Đổ bóng Glow từ ảnh gốc */

//         /* HIỆU ỨNG VÀO: Di chuyển background thay vì đổi màu */
//         transition-all duration-700 ease-in-out

//         /* Khi Hover: Đẩy background sang phải 100% để hiện dải màu ngược */
//         hover:bg-position-[100%_0%]
//         hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]

//         mb-px bg-linear-to-b from-[#418bdb] to-[#1047a4] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm"
//       >
//         THÔNG TIN ĐÃ TRÍCH TỪ FILE
//       </div>
//       <table className="w-full border-collapse border border-gray-400">
//         <tbody>
//           {Object.entries(sections)
//             .reduce((acc: any[], [key, section]) => {
//               acc.push({ key, section });
//               return acc;
//             }, [])
//             .reduce((rows: any[][], sectionObj, index) => {
//               const rowIndex = Math.floor(index / 3); // 3 cột mỗi row
//               if (!rows[rowIndex]) rows[rowIndex] = [];
//               rows[rowIndex].push(sectionObj);
//               return rows;
//             }, [])
//             .map((rowSections, rowIdx) => (
//               <tr key={`row-${rowIdx}`}>
//                 {rowSections.map(({ key, section }) => (
//                   <td key={key} className={tdClass}>
//                     <div className="font-medium mb-1">{section.heading}</div>

//                     {/* Nếu có rows → hiển thị dạng bảng con */}
//                     {section.rows && section.rows.length > 0 ? (
//                       <table className="w-full border-collapse border border-gray-400 mb-2">
//                         <thead>
//                           <tr className="bg-[#e6edf5]">
//                             {Object.keys(section.rows[0] || {}).map((field) => (
//                               <th key={field} className="border border-gray-400 px-2 py-1 text-xs font-medium">
//                                 {field}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {section.rows.map((row: any, idx: number) => (
//                             <tr key={idx}>
//                               {Object.keys(row).map((field) => (
//                                 <td key={field} className="border border-gray-400 px-2 py-1">
//                                   <input
//                                     type="text"
//                                     value={row[field] || ""}
//                                     onChange={(e) => updateRowField(key, idx, field, e.target.value)}
//                                     className={inputClass}
//                                   />
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     ) : (
//                       // Dạng text ngắn
//                       <textarea
//                         value={section.content || ""}
//                         onChange={(e) => updateContent(key, e.target.value)}
//                         rows={2}
//                         className="w-full border border-gray-400 px-2 py-1 text-[13px] resize-y"
//                       />
//                     )}

//                     {/* Sub fields */}
//                     {section.sub_fields &&
//                       Object.entries(section.sub_fields).map(([subKey, value]) => (
//                         <div key={`sub-${key}-${subKey}`} className="mt-1">
//                           <label className="font-medium text-xs">{subKey.replace(/_/g, " ")}</label>
//                           <input
//                             type="text"
//                             value={String(value || "")}
//                             onChange={(e) => updateSubField(key, subKey, e.target.value)}
//                             className={inputClass}
//                           />
//                         </div>
//                       ))}
//                   </td>
//                 ))}

//                 {/* Điền thêm cột trống nếu row chưa đủ 3 cột */}
//                 {rowSections.length < 3 &&
//                   Array.from({ length: 3 - rowSections.length }).map((_, idx) => (
//                     <td key={`empty-${idx}`} className={tdClass}></td>
//                   ))}
//               </tr>
//             ))}
//         </tbody>
//       </table>

//       <div className="flex justify-end gap-4 pt-8">
//         <button
//           onClick={() => router.back()}
//           className="px-8 py-3 cursor-pointer hover:opacity-75 rounded-lg underline  border-[#80B5D7] text-[14px]"
//         >
//           Quay lại
//         </button>
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="bg-[#3872B2] border border-[#80B5D7] cursor-pointer hover:opacity-75 text-[14px] font-bold px-10 py-3 text-white rounded-lg disabled:opacity-60"
//         >
//           {saving ? "Đang lưu..." : "Lưu thay đổi"}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { syllabusApi } from "@/lib/syll";
import { Syllabus } from "@/types/syll";

export default function SyllabusEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await syllabusApi.getById(id as string);
        setSyllabus(data);
        setSections(data.sections || {});
      } catch {
        alert("Không tìm thấy syllabus");
        router.push("/trich-xuat");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, router]);

  const updateContent = (key: string, value: string) => {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], content: value } }));
  };

  const updateSubField = (key: string, subKey: string, value: string) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], sub_fields: { ...(prev[key]?.sub_fields || {}), [subKey]: value } },
    }));
  };

  const updateRowField = (sectionKey: string, rowIndex: number, field: string, value: string) => {
    setSections((prev) => {
      const newRows = [...(prev[sectionKey].rows || [])];
      newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
      return { ...prev, [sectionKey]: { ...prev[sectionKey], rows: newRows } };
    });
  };

  const handleSave = async () => {
    if (!syllabus) return;
    setSaving(true);
    try {
      await syllabusApi.update(syllabus._id, sections);
      alert("Lưu thành công!");
      router.push("/trich-xuat");
    } catch (err: any) {
      alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-sm">Đang tải...</div>;

  const inputClass = "w-full border border-gray-300 px-2 py-1 text-sm rounded bg-white";
  const labelClass = "font-medium text-sm mb-1 block";
  const tdClass = "border border-gray-300 px-2 py-2 align-top";

  // Chia sections thành các hàng, mỗi hàng 2 cột
  const sectionEntries = Object.entries(sections);
  const rows: [string, any][][] = [];
  for (let i = 0; i < sectionEntries.length; i += 2) {
    rows.push(sectionEntries.slice(i, i + 2));
  }

  return (
    <div className=" mx-auto p-4 bg-white rounded shadow-sm text-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Chỉnh sửa hồ sơ</h2>
          <div className="text-xs text-gray-500">{syllabus?.originalName}</div>
        </div>
        <button onClick={() => router.push("/trich-xuat")} className="text-blue-600 hover:underline text-sm">
          ← Quay lại danh sách
        </button>
      </div>
      <div
        className="w-full
         /* Layout & Text */
        relative px-6
        inline-flex items-center justify-center
        overflow-hidden

        /* KỸ THUẬT: Tạo background dài gấp đôi chứa cả 2 dải màu */
        bg-[linear-gradient(to_right,#1E57A3,#2A85C9,#46A9E0,#2A85C9,#1E57A3)]
         bg-size-[200%_100%]
        bg-position-[0%_0%]

        /* Đổ bóng Glow từ ảnh gốc */

        /* HIỆU ỨNG VÀO: Di chuyển background thay vì đổi màu */
        transition-all duration-700 ease-in-out

        /* Khi Hover: Đẩy background sang phải 100% để hiện dải màu ngược */
        hover:bg-position-[100%_0%]
        hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]

        mb-px bg-linear-to-b from-[#418bdb] to-[#1047a4] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm"
      >
        THÔNG TIN ĐÃ TRÍCH TỪ FILE
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((rowSections, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex gap-4">
            {rowSections.map(([key, section], colIdx) => (
              <div
                key={key}
                className={`flex-1 p-3 rounded border border-gray-300 ${
                  colIdx % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <div className="font-medium mb-2">{section.heading}</div>

                {/* Dạng bảng con */}
                {section.rows && section.rows.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-300 mb-2">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(section.rows[0] || {}).map((field) => (
                          <th key={field} className="border border-gray-300 px-2 py-1 text-xs font-medium">
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row: any, idx: number) => (
                        <tr key={idx}>
                          {Object.keys(row).map((field) => (
                            <td key={field} className="border border-gray-300 px-1 py-1">
                              <input
                                type="text"
                                value={row[field] || ""}
                                onChange={(e) => updateRowField(key, idx, field, e.target.value)}
                                className={inputClass}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <textarea
                    value={section.content || ""}
                    onChange={(e) => updateContent(key, e.target.value)}
                    rows={3}
                    className={inputClass + " resize-y"}
                  />
                )}

                {/* Sub fields */}
                {section.sub_fields &&
                  Object.entries(section.sub_fields).map(([subKey, value]) => (
                    <div key={`sub-${key}-${subKey}`} className="mt-2">
                      <label className={labelClass}>{subKey.replace(/_/g, " ")}</label>
                      <input
                        type="text"
                        value={String(value || "")}
                        onChange={(e) => updateSubField(key, subKey, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
              </div>
            ))}

            {/* Nếu row chưa đủ 2 cột → thêm cột trống */}
            {rowSections.length < 2 && <div className="flex-1"></div>}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 rounded border border-gray-400 hover:bg-gray-100 text-sm"
        >
          Quay lại
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
