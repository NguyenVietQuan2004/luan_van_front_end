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

//   // ==================== MAP DỊCH TOÀN BỘ TIẾNG ANH → TIẾNG VIỆT ====================
//   const fieldTranslations: Record<string, string> = {
//     // Sub fields
//     permanent_address: "Nơi thường trú",
//     temporary_address: "Nơi tạm trú",
//     general_education: "Giáo dục phổ thông",
//     vocational_education: "Giáo dục nghề nghiệp",
//     higher_education: "Giáo dục đại học và sau đại học",
//     specialization: "Chuyên môn, nghiệp vụ",
//     academic_title: "Học hàm",
//     political_theory: "Lý luận chính trị",
//     foreign_language: "Ngoại ngữ",
//     it_skills: "Tin học",
//     ethnic_language: "Tiếng dân tộc thiểu số",
//     first_join: "Ngày và nơi vào Đảng lần thứ nhất",
//     official_recognition: "Ngày và nơi công nhận chính thức lần thứ nhất",
//     referrer_1: "Người giới thiệu 1",
//     referrer_2: "Người giới thiệu 2",

//     // Table fields - Section 16
//     from_to: "Thời gian",
//     workplace: "Nơi làm việc",
//     position: "Chức vụ",

//     // Section 18 - Đào tạo bồi dưỡng
//     school: "Tên trường",
//     major_form: "Ngành học / Hình thức",
//     certificate: "Văn bằng / Chứng chỉ",

//     // Section 19 - Đi nước ngoài
//     time: "Thời gian",
//     purpose: "Nội dung đi",
//     country: "Nước",

//     // Section 20 - Khen thưởng
//     reason: "Lý do",
//     authority: "Cấp quyết định",

//     // Section 21 - Kỷ luật
//     // reason và authority đã có ở trên
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await syllabusApi.getById(id as string);
//         setSyllabus(data);
//         setSections(data.sections || {});
//       } catch {
//         alert("Không tìm thấy hồ sơ");
//         router.push("/trich-xuat");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [id, router]);

//   const updateContent = (key: string, value: string) => {
//     setSections((prev) => ({ ...prev, [key]: { ...prev[key], content: value } }));
//   };

//   const updateSubField = (key: string, subKey: string, value: string) => {
//     setSections((prev) => ({
//       ...prev,
//       [key]: {
//         ...prev[key],
//         sub_fields: { ...(prev[key]?.sub_fields || {}), [subKey]: value },
//       },
//     }));
//   };

//   const updateRowField = (sectionKey: string, rowIndex: number, field: string, value: string) => {
//     setSections((prev) => {
//       const newRows = [...(prev[sectionKey].rows || [])];
//       newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
//       return { ...prev, [sectionKey]: { ...prev[sectionKey], rows: newRows } };
//     });
//   };

//   const handleSave = async () => {
//     if (!syllabus) return;
//     setSaving(true);
//     try {
//       await syllabusApi.update(syllabus._id, sections);
//       alert("Lưu thành công!");
//       router.push("/trich-xuat");
//     } catch (err: any) {
//       alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="p-6 text-center text-sm">Đang tải...</div>;
//   const listInput = [1, 2, 3, 4, 5, 6, 9, 10];
//   const inputClass =
//     "w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200";

//   return (
//     <div className="max-w-7xl text-gray-700 text-xs! mx-auto p-6 bg-white min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">Chỉnh sửa hồ sơ</h1>
//           <p className="text-sm text-gray-500 mt-1">File đã tải: {syllabus?.originalName}</p>
//         </div>
//         <button
//           onClick={() => router.push("/trich-xuat")}
//           className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
//         >
//           ← Quay lại danh sách
//         </button>
//       </div>

//       <div className="flex gap-4">
//         {/* Bên trái - Ảnh gốc */}
//         <div className="w-5/12">
//           <div className="border border-gray-200 rounded-xl h-[620px] flex flex-col items-center justify-center bg-gray-50">
//             <div className="text-center">
//               <div className="mx-auto w-16 h-20 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center mb-4">
//                 📄
//               </div>
//               <p className="font-medium ">Ảnh gốc / File gốc</p>
//               <p className="text-sm text-gray-500 mt-2 px-8">Chèn ảnh scan hoặc file PDF gốc vào đây</p>
//             </div>
//           </div>
//           <div className="mt-4 text-center text-xs text-gray-500">
//             Bên trái để xem tài liệu gốc
//             <br />
//             Bên phải chỉnh sửa thông tin
//           </div>
//         </div>

//         {/* Bên phải - Thông tin đã trích xuất */}
//         <div className="flex-1">
//           {/* <div className="bg-blue-600 text-white text-center py-3.5 rounded-t-xl font-semibold text-base tracking-wide">
//             THÔNG TIN ĐÃ TRÍCH XUẤT
//           </div> */}
//           <div
//             className="w-full
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

//         mb-px bg-linear-to-b from-[#418bdb] to-[#1047a4] text-[12px] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm"
//           >
//             THÔNG TIN ĐÃ TRÍCH XUẤT
//           </div>
//           <div className="border border-gray-200 grid  grid-cols-3 gap-x-3 border-t-0 rounded-b-xl p-6 space-y-9 bg-white">
//             {Object.entries(sections).map(([key, section], index) => (
//               <div key={key} className={`mb-6  ${!listInput.includes(index + 1) && "col-span-3"} `}>
//                 <h3 className="font-semibold mb-3 text-[13px]! text-gray-800">{section.heading}</h3>

//                 {/* Nội dung chính (textarea) */}
//                 {(!section.rows || section.rows.length === 0) &&
//                   (listInput.includes(index + 1) ? (
//                     <input
//                       value={section.content || ""}
//                       onChange={(e) => updateContent(key, e.target.value)}
//                       className={`${inputClass} resize-y text-xs! `}
//                     />
//                   ) : (
//                     <textarea
//                       value={section.content || ""}
//                       onChange={(e) => updateContent(key, e.target.value)}
//                       rows={4}
//                       className={`${inputClass} resize-y text-xs!`}
//                     />
//                   ))}

//                 {/* Bảng nhiều dòng (các section có rows) */}
//                 {section.rows && section.rows.length > 0 && (
//                   <div className="space-y-4">
//                     {section.rows.map((row: any, idx: number) => (
//                       <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {Object.entries(row).map(([field, value]) => (
//                           <div key={field}>
//                             <label className="block  font-medium text-gray-500 mb-1">
//                               {fieldTranslations[field] || field.replace(/_/g, " ")}
//                             </label>
//                             <input
//                               type="text"
//                               value={String(value || "")}
//                               onChange={(e) => updateRowField(key, idx, field, e.target.value)}
//                               className={`${inputClass} text-xs`}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Sub fields - Gộp 2 cột */}
//                 {section.sub_fields && Object.keys(section.sub_fields).length > 0 && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     {Object.entries(section.sub_fields).map(([subKey, value]) => (
//                       <div key={subKey}>
//                         <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                           {fieldTranslations[subKey] || subKey.replace(/_/g, " ")}
//                         </label>
//                         <input
//                           type="text"
//                           value={String(value || "")}
//                           onChange={(e) => updateSubField(key, subKey, e.target.value)}
//                           className={inputClass + " text-xs"}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Nút hành động */}
//           <div className="flex justify-end gap-4 mt-8">
//             <button
//               onClick={() => router.back()}
//               className="px-6 py-2.5 underline border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
//             >
//               Quay lại
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="px-8 py-2.5 bg-[#2d63ad]  text-white rounded-lg disabled:opacity-70 font-medium text-sm"
//             >
//               {saving ? "Đang lưu..." : "Lưu thay đổi"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { syllabusApi } from "@/lib/syll";
import { Syllabus } from "@/types/syll";
import WordPreview from "./imgs";

export default function SyllabusEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==================== MAP DỊCH TOÀN BỘ TIẾNG ANH → TIẾNG VIỆT ====================
  const fieldTranslations: Record<string, string> = {
    // Sub fields
    permanent_address: "Nơi thường trú",
    temporary_address: "Nơi tạm trú",
    general_education: "Giáo dục phổ thông",
    vocational_education: "Giáo dục nghề nghiệp",
    higher_education: "Giáo dục đại học và sau đại học",
    specialization: "Chuyên môn, nghiệp vụ",
    academic_title: "Học hàm",
    political_theory: "Lý luận chính trị",
    foreign_language: "Ngoại ngữ",
    it_skills: "Tin học",
    ethnic_language: "Tiếng dân tộc thiểu số",
    first_join: "Ngày và nơi vào Đảng lần thứ nhất",
    official_recognition: "Ngày và nơi công nhận chính thức lần thứ nhất",
    referrer_1: "Người giới thiệu 1",
    referrer_2: "Người giới thiệu 2",

    // Table fields - Section 16
    from_to: "Thời gian",
    workplace: "Nơi làm việc",
    position: "Chức vụ",

    // Section 18 - Đào tạo bồi dưỡng
    school: "Tên trường",
    major_form: "Ngành học / Hình thức",
    certificate: "Văn bằng / Chứng chỉ",

    // Section 19 - Đi nước ngoài
    time: "Thời gian",
    purpose: "Nội dung đi",
    country: "Nước",

    // Section 20 - Khen thưởng
    reason: "Lý do",
    authority: "Cấp quyết định",

    // Section 21 - Kỷ luật
    // reason và authority đã có ở trên
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await syllabusApi.getById(id as string);
        setSyllabus(data);
        setSections(data.sections || {});
      } catch {
        alert("Không tìm thấy hồ sơ");
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
      [key]: {
        ...prev[key],
        sub_fields: { ...(prev[key]?.sub_fields || {}), [subKey]: value },
      },
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

  const listInput = [1, 2, 3, 4, 5, 6, 9, 10];
  const inputClass =
    "w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200";

  return (
    <div className="max-w-7xl text-gray-700 text-xs! mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Chỉnh sửa hồ sơ</h1>
          {/* <p className="text-sm text-gray-500 mt-1">File đã tải: {syllabus?.originalName}</p> */}

          {syllabus?.file_path && (
            <a
              href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${syllabus?.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 mt-1 underline"
            >
              {syllabus.originalName}
            </a>
          )}
        </div>
        <button
          onClick={() => router.push("/trich-xuat")}
          className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
        >
          ← Quay lại danh sách
        </button>
      </div>

      <div className="flex gap-4">
        {/* ==================== BÊN TRÁI - ĐÃ BỔ SUNG FILE GỐC ==================== */}
        <div className="w-5/12">
          <div className="border border-gray-200 rounded-xl h-175 overflow-auto flex flex-col bg-gray-50 ">
            {/* <div className="bg-[#2d63ad] text-white text-center py-3 font-medium text-sm">TÀI LIỆU GỐC</div> */}
            {/* 
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {syllabus?.file_path ? (
                <>
                  <div className="text-6xl mb-4">📄</div>
                  <p className="font-medium text-gray-700 mb-2">File gốc đã upload</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${syllabus.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all text-sm font-medium"
                  >
                    {syllabus.originalName}
                  </a>
                  <p className="text-xs text-gray-500 mt-4">Click vào tên file để xem hoặc tải về</p>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-20 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center mb-4">
                    📄
                  </div>
                  <p className="font-medium">Ảnh gốc / File gốc</p>
                  <p className="text-sm text-gray-500 mt-2 px-8">Chèn ảnh scan hoặc file PDF gốc vào đây</p>
                </>
              )}
            </div> */}

            <WordPreview url={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${syllabus?.file_path}`} />
          </div>

          {/* <div className="mt-4 text-center text-xs text-gray-500">
            Bên trái để xem tài liệu gốc
            <br />
            Bên phải chỉnh sửa thông tin
          </div> */}
        </div>

        {/* ==================== BÊN PHẢI - GIỮ NGUYÊN HOÀN TOÀN ==================== */}
        <div>
          <div
            className="w-full
             relative px-6 
             inline-flex items-center justify-center
             overflow-hidden
             bg-[linear-gradient(to_right,#1E57A3,#2A85C9,#46A9E0,#2A85C9,#1E57A3)]
              bg-size-[200%_100%]
             bg-position-[0%_0%]
             transition-all duration-700 ease-in-out
             hover:bg-position-[100%_0%]
             hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]
             mb-px bg-linear-to-b from-[#418bdb] to-[#1047a4] text-[12px] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm"
          >
            THÔNG TIN ĐÃ TRÍCH XUẤT
          </div>

          <div className="flex-1 max-h-[70vh] overflow-auto border rounded-sm">
            <div className="border border-gray-200 grid grid-cols-3 gap-x-3 border-t-0 rounded-b-xl p-6 space-y-9 bg-white">
              {Object.entries(sections).map(([key, section], index) => (
                <div key={key} className={`mb-6 ${!listInput.includes(index + 1) && "col-span-3"} `}>
                  <h3 className="font-semibold mb-3 text-[13px]! text-gray-800">{section.heading}</h3>

                  {/* Nội dung chính (textarea) */}
                  {(!section.rows || section.rows.length === 0) &&
                    (listInput.includes(index + 1) ? (
                      <input
                        value={section.content || "none"}
                        onChange={(e) => updateContent(key, e.target.value)}
                        className={`${inputClass} resize-y text-xs! `}
                      />
                    ) : (
                      <textarea
                        value={section.content || ""}
                        onChange={(e) => updateContent(key, e.target.value)}
                        rows={5}
                        className={`${inputClass} resize-y text-xs!`}
                      />
                    ))}

                  {/* Bảng nhiều dòng */}
                  {section.rows && section.rows.length > 0 && (
                    <div className="space-y-4">
                      {section.rows.map((row: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(row).map(([field, value]) => (
                            <div key={field}>
                              <label className="block font-medium text-gray-500 mb-1">
                                {fieldTranslations[field] || field.replace(/_/g, " ")}
                              </label>
                              <input
                                type="text"
                                value={String(value || "")}
                                onChange={(e) => updateRowField(key, idx, field, e.target.value)}
                                className={`${inputClass} text-xs`}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sub fields */}
                  {section.sub_fields && Object.keys(section.sub_fields).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {Object.entries(section.sub_fields).map(([subKey, value]) => (
                        <div key={subKey}>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            {fieldTranslations[subKey] || subKey.replace(/_/g, " ")}
                          </label>
                          <input
                            type="text"
                            value={String(value || "")}
                            onChange={(e) => updateSubField(key, subKey, e.target.value)}
                            className={inputClass + " text-xs"}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Nút hành động */}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 underline border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Quay lại
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2.5 bg-[#2d63ad] text-white rounded-lg disabled:opacity-70 font-medium text-sm"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
