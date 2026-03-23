"use client";

import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const headingSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    level: z.number().min(1).max(6),
    title: z.string().min(1, "Tiêu đề bắt buộc"),
    type: z.enum(["number", "alpha", "roman", "bullet", "dash"]),
    children: z.array(headingSchema).default([]),
  }),
);

const bienBanSchema = z.object({
  coQuanChuQuan: z.string().min(1),
  coQuanToChuc: z.string().min(1),
  so: z.string().min(1),
  tenCuocHop: z.string().min(1),
  thoiGianBatDau: z.string().min(1),
  diaDiem: z.string().min(1),
  thanhPhanThamDu: z.string().min(1),
  chuTri: z.string().min(1),
  thuKy: z.string().min(1),
  ketThucNgayGio: z.string().min(1),
  fullString: z.string().min(1),
  headings: z.array(headingSchema).min(0), // cho phép rỗng
});

type BienBanForm = z.infer<typeof bienBanSchema>;

const toRoman = (num: number): string => {
  const roman: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let res = "";
  for (const [val, sym] of roman) {
    while (num >= val) {
      res += sym;
      num -= val;
    }
  }
  return res;
};

function HeadingItem({
  control,
  path,
  level,
  parentPrefix = "",
  onRemove,
}: {
  control: any;
  path: string;
  level: number;
  parentPrefix?: string;
  onRemove?: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${path}.children`,
  });

  const type = useWatch({ control, name: `${path}.type` }) || "number";
  const indexMatch = path.match(/\.(\d+)$/);
  const currentIndex = indexMatch ? parseInt(indexMatch[1]) : 0;

  const getSymbol = (typ: string, idx: number) => {
    if (typ === "number") return `${idx + 1}.`;
    if (typ === "alpha") return `${String.fromCharCode(97 + idx)}.`;
    if (typ === "roman") return `${toRoman(idx + 1)}.`;
    if (typ === "bullet") return "•";
    if (typ === "dash") return "-";
    return `${idx + 1}.`;
  };

  const currentSymbol = getSymbol(type, currentIndex);
  const fullPrefix = parentPrefix ? `${parentPrefix}${currentSymbol}` : currentSymbol;

  const input = "bg-white w-full h-[26px] px-2 border border-gray-400 text-[13px]";
  const btnSmall =
    "bg-[#F7F7F7] border border-[#243f50] text-[#515151] hover:bg-gray-200 px-2.5 py-0.5 text-xs rounded";

  return (
    <div className="mt-1.5 border border-gray-300 rounded bg-white">
      {/* Header row */}
      <div className="flex items-center gap-3 bg-[#e6edf5] px-3 py-1.5 border-b border-gray-300">
        <span className="font-medium text-[#0b3d91] min-w-15 text-right text-[13.5px] tracking-tight">
          {fullPrefix}
        </span>

        <Controller
          name={`${path}.title`}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Tiêu đề mục..."
              className="flex-1 h-6.5 px-2.5 border border-gray-400 text-[13px] rounded"
            />
          )}
        />

        <select
          className="h-6.5 px-2 border border-gray-400 text-[13px] bg-white rounded"
          {...control.register(`${path}.type`)}
        >
          <option value="number">1. 2. 3.</option>
          <option value="alpha">a. b. c.</option>
          <option value="roman">i. ii. iii.</option>
          <option value="bullet">•</option>
          <option value="dash">-</option>
        </select>

        {onRemove && (
          <button type="button" onClick={onRemove} className="text-red-600 hover:text-red-800 text-xs">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Thêm con */}
      {level < 6 && (
        <div className="px-3 py-1.5 bg-[#f9fcff] border-t border-gray-200">
          <button
            type="button"
            onClick={() => append({ level: level + 1, title: "", type: "number", children: [] })}
            className={btnSmall}
          >
            + Thêm cấp {level + 1}
          </button>
        </div>
      )}

      {/* Con */}
      {fields.length > 0 && (
        <div className="bg-[#f9fcff] p-2 space-y-1.5 border-t border-gray-200">
          {fields.map((f, i) => (
            <HeadingItem
              key={f.id}
              control={control}
              path={`${path}.children.${i}`}
              level={level + 1}
              parentPrefix={fullPrefix}
              onRemove={() => remove(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BienBanFormPage() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName] = useState("BienBanCuocHop.docx"); // hoặc động hơn nếu muốn

  const form = useForm<BienBanForm>({
    resolver: zodResolver(bienBanSchema),
    defaultValues: {
      coQuanChuQuan: "",
      coQuanToChuc: "",
      so: "",
      tenCuocHop: "",
      thoiGianBatDau: "",
      diaDiem: "",
      thanhPhanThamDu: "",
      chuTri: "",
      thuKy: "",
      ketThucNgayGio: "",
      fullString: "",
      headings: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "headings",
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border border-gray-400 text-[13px] whitespace-nowrap";

  const flattenHeadingsNumbered = (nodes: any[], prefix: string[] = []): any[] => {
    let result: any[] = [];
    let counterLevel1 = 0;
    nodes.forEach((node, index) => {
      let currentPrefix = [...prefix];
      if (prefix.length === 0) {
        currentPrefix = [counterLevel1.toString()];
        counterLevel1++;
      } else {
        currentPrefix.push(index.toString());
      }
      const numberedId = currentPrefix.join(".");
      result.push({
        id: numberedId,
        title: node.title,
        type: node.type,
        level: node.level,
      });
      if (node.children && node.children.length > 0) {
        result.push(...flattenHeadingsNumbered(node.children, currentPrefix));
      }
    });
    return result;
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Tùy chọn: dọn dẹp sau khi tải (khuyến khích)
    window.URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null); // ẩn nút sau khi tải
  };
  const onSubmit = async (data: BienBanForm) => {
    try {
      // Bước 1: Phân loại (giữ nguyên, nhưng sửa fullString)
      const classifyRes = await fetch("http://127.0.0.1:8000/classify-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullString: JSON.stringify(data.fullString), // ← sửa: bỏ JSON.stringify ở đây
          structure: JSON.stringify(flattenHeadingsNumbered(data.headings)),
        }),
      });

      if (!classifyRes.ok) throw new Error("Lỗi phân loại");

      const classified = await classifyRes.json();

      // Bước 2: Tạo file Word
      const docRes = await fetch("http://127.0.0.1:8000/create-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          classified,
        }),
      });

      if (!docRes.ok) throw new Error(`Lỗi tạo file: ${docRes.status}`);

      const blob = await docRes.blob();
      const url = window.URL.createObjectURL(blob);

      // Lưu URL để hiển thị nút tải
      setDownloadUrl(url);

      alert("Biên bản đã tạo xong! Nhấn nút bên dưới để tải về.");
    } catch (err) {
      console.error(err);
      alert("Lỗi: " + (err instanceof Error ? err.message : "Không xác định"));
    }
  };
  return (
    <div className="container text-[13px] mx-auto p-4 bg-white border border-[#ccc] rounded-[5px]">
      <form onSubmit={handleSubmit(onSubmit)} className="pb-10">
        <div className="w-full mb-px mt-2 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900">
          Tạo Biên Bản Cuộc Họp
        </div>

        <table className="w-full border-collapse border border-gray-300 text-[13px]">
          <tbody>
            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-3 py-1.5 font-semibold border">
                Thông tin cơ bản
              </td>
            </tr>

            <tr>
              <td className={label}>Cơ quan chủ quản</td>
              <td className="border px-2 py-1">
                <input {...register("coQuanChuQuan")} className={input} />
              </td>
              <td className={label}>Cơ quan tổ chức</td>
              <td className="border px-2 py-1">
                <input {...register("coQuanToChuc")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Số văn bản</td>
              <td className="border px-2 py-1">
                <input {...register("so")} className={input} />
              </td>
              <td className={label}>Tên cuộc họp</td>
              <td className="border px-2 py-1" colSpan={3}>
                <input {...register("tenCuocHop")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Thời gian bắt đầu</td>
              <td className="border px-2 py-1">
                <input {...register("thoiGianBatDau")} className={input} />
              </td>
              <td className={label}>Địa điểm</td>
              <td className="border px-2 py-1">
                <input {...register("diaDiem")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Thành phần tham dự</td>
              <td colSpan={3} className="border px-2 py-1.5">
                <textarea
                  {...register("thanhPhanThamDu")}
                  rows={3}
                  className="w-full border border-gray-400 px-2 py-1 text-[13px]"
                />
              </td>
            </tr>

            <tr>
              <td className={label}>Chủ trì</td>
              <td className="border px-2 py-1">
                <input {...register("chuTri")} className={input} />
              </td>
              <td className={label}>Thư ký</td>
              <td className="border px-2 py-1">
                <input {...register("thuKy")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Kết thúc ngày giờ</td>
              <td colSpan={3} className="border px-2 py-1">
                <input {...register("ketThucNgayGio")} className={input} />
              </td>
            </tr>

            {/* Nội dung biên bản */}
            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-3 py-1.5 font-semibold border">
                Nội dung biên bản
              </td>
            </tr>

            <tr>
              <td colSpan={4} className="border px-2 py-2">
                <textarea
                  {...register("fullString")}
                  rows={10}
                  className="w-full border border-gray-400 px-2 py-1.5 text-[13px] font-mono resize-y"
                  placeholder="Dán toàn bộ nội dung biên bản vào đây..."
                />
              </td>
            </tr>

            {/* Cấu trúc heading */}
            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-3 py-1.5 font-semibold border">
                <div className="flex justify-between items-center">
                  Cấu trúc nội dung
                  <button
                    type="button"
                    onClick={() => append({ level: 1, title: "", type: "number", children: [] })}
                    className="bg-[#F7F7F7] border border-[#243f50] text-[#515151] hover:bg-gray-200 px-3 py-0.5 text-xs rounded flex items-center gap-1"
                  >
                    <Plus size={14} /> Thêm mục cấp 1
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan={4} className="p-0 border-0">
                <div className="p-3 bg-[#f9fcff] space-y-2">
                  {fields.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 border border-dashed rounded bg-white">
                      Chưa có mục nào. Nhấn "Thêm mục cấp 1" để bắt đầu
                    </div>
                  ) : (
                    fields.map((field, idx) => (
                      <HeadingItem
                        key={field.id}
                        control={form.control}
                        path={`headings.${idx}`}
                        level={1}
                        onRemove={() => remove(idx)}
                      />
                    ))
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end gap-4 pt-6">
          <button type="button" className="px-8 py-2.5 bg-gray-200 hover:bg-gray-300 rounded text-[13px]">
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-2.5 bg-[#3872B2] hover:bg-[#2f6fb3] text-white rounded text-[13px] font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu"}
          </button>
        </div>

        {downloadUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-medium mb-3 text-[14px]">Biên bản đã được tạo thành công!</p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 bg-[#3872B2] hover:bg-green-700 text-white font-medium rounded-lg shadow transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Tải file BienBan.docx
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
