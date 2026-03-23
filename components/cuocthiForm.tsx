"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ====== UTIL ======
function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.split("T")[0];
}

function toISO(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date.toISOString();
}

type CuocthiFormData = {
  name: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_members: number;
  location?: string;
  type: "online" | "offline";
  note?: string;
  // rules_file sẽ xử lý riêng qua file input, không cần trong form values
};

type Props = {
  initialData?: any | null; // Partial<Cuocthi>
  onSubmit: (formData: FormData) => Promise<any>;
  isNew: string; // "Thêm cuộc thi mới" hoặc "Cập nhật cuộc thi"
};

export default function CuocthiForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null); // để hiển thị file cũ khi edit

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CuocthiFormData>({
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
      registration_deadline: "",
      max_members: 100,
      location: "",
      type: "online",
      note: "",
    },
  });
  // Reset form + lưu file path cũ khi edit
  useEffect(() => {
    if (!initialData) return;

    setCurrentFilePath(initialData.rules_file || null);

    reset({
      name: initialData.name || "",
      start_date: toDateInput(initialData.start_date),
      end_date: toDateInput(initialData.end_date),
      registration_deadline: toDateInput(initialData.registration_deadline),
      max_members: initialData.max_members || 100,
      location: initialData.location || "",
      type: initialData.type || "online",
      note: initialData.note || "",
    });
  }, [initialData, reset]);

  // Submit handler: dùng FormData để gửi cả text + file
  const submitHandler = handleSubmit(async (values) => {
    const formData = new FormData();

    // Append dữ liệu text dưới dạng JSON string (giống mẫu applicant)
    const textData = {
      ...values,
      start_date: toISO(values.start_date),
      end_date: toISO(values.end_date),
      registration_deadline: toISO(values.registration_deadline),
    };
    formData.append("data", JSON.stringify(textData));

    // Nếu có file mới upload → append
    if (file) {
      formData.append("file", file);
    }

    try {
      await onSubmit(formData);
      alert("Lưu thành công!");
      router.push("/cuoc-thi");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
    }
  });

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border";
  const td = "border px-2 bg-gray-100 py-2";

  return (
    <div className="container text-[13px] mx-auto p-4 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <form onSubmit={submitHandler} className="space-y-10 pb-12">
        <div className="w-full mb-px mt-4 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>

        <table className="w-full border-collapse border">
          <tbody>
            <tr>
              <td colSpan={4} className="font-bold text-[14px] bg-[#EDF4F9] pl-2 py-1">
                Thông tin cuộc thi
              </td>
            </tr>

            <tr>
              <td className={label}>Tên cuộc thi *</td>
              <td className={td} colSpan={3}>
                <input {...register("name")} className={input} required />
              </td>
            </tr>

            <tr>
              <td className={label}>Loại hình</td>
              <td className={td}>
                <select {...register("type")} className={input}>
                  <option value="online">Trực tuyến</option>
                  <option value="offline">Trực tiếp</option>
                </select>
              </td>

              <td className={label}>Địa điểm (nếu offline)</td>
              <td className={td}>
                <input {...register("location")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày bắt đầu</td>
              <td className={td}>
                <input type="date" {...register("start_date")} className={input} required />
              </td>

              <td className={label}>Ngày kết thúc</td>
              <td className={td}>
                <input type="date" {...register("end_date")} className={input} required />
              </td>
            </tr>

            <tr>
              <td className={label}>Hạn đăng ký</td>
              <td className={td}>
                <input type="date" {...register("registration_deadline")} className={input} required />
              </td>

              <td className={label}>Số lượng tối đa</td>
              <td className={td}>
                <input
                  type="number"
                  {...register("max_members", { valueAsNumber: true })}
                  className={input}
                  min={1}
                  required
                />
              </td>
            </tr>

            {/* Phần upload file - giống ApplicantForm */}
            <tr>
              <td className={label}>File quy định (PDF, DOCX,...)</td>
              <td className={td} colSpan={3}>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F7F7F7] file:text-[#515151]  file:border-[#243f50] hover:file:bg-[#e0e0e0]"
                />
                {currentFilePath && !file && (
                  <div className="mt-2 text-sm text-blue-600">
                    File hiện tại:
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${currentFilePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-800"
                    >
                      {currentFilePath.split("/").pop()}
                    </a>
                  </div>
                )}
                {file && (
                  <p className="mt-2 text-sm text-green-600">
                    Đã chọn file mới: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                Ghi chú
              </td>
            </tr>

            <tr>
              <td colSpan={4} className="border px-2 py-2">
                <textarea
                  {...register("note")}
                  rows={4}
                  className="w-full border px-2 py-1 text-[13px]"
                  placeholder="Ghi chú thêm về cuộc thi..."
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Nút hành động */}
        <div className="flex justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 cursor-pointer text-white hover:opacity-75 rounded-lg bg-[#3872B2] border border-[#80B5D7] text-[14px] font-bold"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#3872B2] border cursor-pointer hover:opacity-75 border-[#80B5D7] text-[14px] font-bold px-10 py-3 text-white rounded-lg disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
