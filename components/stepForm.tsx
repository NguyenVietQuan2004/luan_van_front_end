"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepSchema, StepFormData } from "@/types/step";
import { Step } from "@/lib/step"; // hoặc import từ api
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  initialData: Partial<Step> | null;
  onSubmit: (formData: FormData) => Promise<any>;
  isNew: string;
};

export default function StepForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(initialData?.template_file || null);

  const form = useForm<StepFormData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      name: "",
      step_order: 1,
      note: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (!initialData) return;

    reset({
      name: initialData.name || "",
      step_order: initialData.step_order || 1,
      note: initialData.note || "",
    });

    if (initialData.template_file) {
      setExistingFile(initialData.template_file);
      setFileName(initialData.template_file.split("/").pop() || null);
    }
  }, [initialData, reset]);

  const submitHandler = async (data: any) => {
    try {
      const formData = new FormData();

      // Thêm các field text
      formData.append("data", JSON.stringify(data));

      // Thêm file nếu có upload mới
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("file", fileInput.files[0]);
      }

      await onSubmit(formData);

      router.push("/steps");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border";
  const td = "border px-2 bg-gray-100 py-2";

  return (
    <div className=" text-[13px] mx-auto p-4 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-10 pb-12">
        <div className="w-full mb-px  text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>

        <table className="w-full border-collapse border">
          <tbody>
            <tr>
              <td colSpan={4} className="font-bold text-[14px] bg-[#EDF4F9] pl-2 py-1">
                Thông tin bước
              </td>
            </tr>

            <tr>
              <td className={label}>Tên bước *</td>
              <td className={td} colSpan={3}>
                <input {...register("name")} className={input} />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Thứ tự bước *</td>
              <td className={td}>
                <input
                  type="number"
                  {...register("step_order", {
                    valueAsNumber: true,
                  })}
                  className={input}
                  min={1}
                />
                {errors.step_order && <p className="text-red-600 text-xs mt-1">{errors.step_order.message}</p>}
              </td>

              <td className={label}>Ghi chú</td>
              <td className={td}>
                <input {...register("note")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>File mẫu (Word/Excel/PDF)</td>
              <td className={td} colSpan={3}>
                <input
                  type="file"
                  accept=".doc,.docx,.xls,.xlsx,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFileName(file ? file.name : null);
                  }}
                  className="text-sm"
                />
                {fileName && <p className="text-green-600 text-xs mt-1">Đã chọn: {fileName}</p>}
                {existingFile && !fileName && (
                  <p className="text-[#3872b2] text-xs mt-1">File hiện tại: {existingFile.split("/").pop()}</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 cursor-pointer hover:opacity-75 rounded-lg  underline border-[#80B5D7] text-[14px]"

            // className="px-8 py-3 cursor-pointer text-white hover:opacity-75 rounded-lg bg-[#3872B2] border border-[#80B5D7] text-[14px] font-bold"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#3872B2] border cursor-pointer hover:opacity-75 border-[#80B5D7] text-[14px] font-bold px-10 py-3 text-white rounded-lg disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
