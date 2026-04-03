"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HeSoLuong } from "@/types/hesoluong";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  ma_ngach: z.string().min(1, "Mã ngạch không được để trống"),
  bac: z.number().int().positive("Bậc phải là số nguyên dương"),
  he_so_luong: z.number().positive("Hệ số lương phải lớn hơn 0"),
});

type HeSoLuongFormData = z.infer<typeof formSchema>;

type Props = {
  initialData: Partial<HeSoLuong> | null;
  onSubmit: (data: Partial<HeSoLuong>) => Promise<any>;
  isNew: string;
};

export default function HeSoLuongForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HeSoLuongFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ma_ngach: "",
      bac: 1,
      he_so_luong: 2.1,
    },
  });

  // Reset form khi có dữ liệu ban đầu (edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        ma_ngach: initialData.ma_ngach || "",
        bac: initialData.bac || 1,
        he_so_luong: initialData.he_so_luong || 2.1,
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (values: HeSoLuongFormData) => {
    try {
      await onSubmit(values);
      // Quay lại danh sách sau khi lưu thành công
      router.push("/he-so-luong");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  // Style giống hệt DangVienForm
  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border text-[13px]";
  const td = "border px-2 bg-gray-100 py-2 text-[13px]";
  const errorText = "text-red-600 text-[12px] pl-2";

  return (
    <div className="container text-[13px] mx-auto p-4 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-10 pb-12">
        {/* Tiêu đề */}
        <div className="w-full mb-px mt-4 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>

        <table className="w-full border-collapse border">
          <tbody>
            <tr>
              <td colSpan={4} className="font-bold mb-6 text-[14px] bg-[#EDF4F9] pl-2 py-2">
                Thông tin hệ số lương
              </td>
            </tr>

            <tr>
              <td className={label}>Mã ngạch *</td>
              <td className={td} colSpan={3}>
                <input {...register("ma_ngach")} className={input} placeholder="VD: 01.001, 02.003, 03.004..." />
                {errors.ma_ngach && <p className={errorText}>{errors.ma_ngach.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Bậc *</td>
              <td className={td}>
                <input type="number" {...register("bac", { valueAsNumber: true })} className={input} min="1" step="1" />
                {errors.bac && <p className={errorText}>{errors.bac.message}</p>}
              </td>

              <td className={label}>Hệ số lương *</td>
              <td className={td}>
                <input
                  type="number"
                  {...register("he_so_luong", { valueAsNumber: true })}
                  className={input}
                  min="0.01"
                />
                {errors.he_so_luong && <p className={errorText}>{errors.he_so_luong.message}</p>}
              </td>
            </tr>

            {/* Có thể thêm dòng mô tả / lưu ý nếu cần */}
            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 text-[13px] border">
                Lưu ý: Mỗi cặp (Mã ngạch + Bậc) phải là duy nhất trong hệ thống.
              </td>
            </tr>
          </tbody>
        </table>

        {/* Nút thao tác */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2f6fb3] hover:bg-[#1e5a9a] text-white px-6 py-2 rounded text-[13px] font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thông tin"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-[#F7F7F7] border border-[#243f50] text-[#515151] px-6 py-2 rounded text-[13px] hover:opacity-90"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
