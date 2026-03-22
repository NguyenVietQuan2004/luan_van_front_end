"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LuongCoSo } from "@/types/luongcoso";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  ngay_bat_dau: z.string().min(1, "Ngày bắt đầu không được để trống"),
  ngay_ket_thuc: z.string().nullable().optional(),
  luong_co_so: z.number().positive("Lương cơ sở phải lớn hơn 0"),
});

type LuongCoSoFormData = z.infer<typeof formSchema>;

type Props = {
  initialData: Partial<LuongCoSo> | null;
  onSubmit: (data: Partial<LuongCoSo>) => Promise<any>;
  isNew: string;
};

export default function LuongCoSoForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LuongCoSoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ngay_bat_dau: "",
      ngay_ket_thuc: null,
      luong_co_so: 1800000,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ngay_bat_dau: initialData.ngay_bat_dau ? new Date(initialData.ngay_bat_dau).toISOString().split("T")[0] : "",
        ngay_ket_thuc: initialData.ngay_ket_thuc
          ? new Date(initialData.ngay_ket_thuc).toISOString().split("T")[0]
          : null,
        luong_co_so: initialData.luong_co_so || 1800000,
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (values: LuongCoSoFormData) => {
    try {
      const payload: Partial<LuongCoSo> = {
        ...values,
        ngay_bat_dau: new Date(values.ngay_bat_dau).toISOString(),
        ngay_ket_thuc: values.ngay_ket_thuc ? new Date(values.ngay_ket_thuc).toISOString() : null,
      };

      await onSubmit(payload);
      router.push("/luong-co-so");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border text-[13px]";
  const td = "border px-2 bg-gray-100 py-2 text-[13px]";
  const errorText = "text-red-600 text-[12px] pl-2";

  return (
    <div className="container text-[13px] mx-auto p-4 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-10 pb-12">
        <div className="w-full mb-px mt-4 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>

        <table className="w-full border-collapse border">
          <tbody>
            <tr>
              <td colSpan={4} className="font-bold mb-6 text-[14px] bg-[#EDF4F9] pl-2 py-2">
                Thông tin mức lương cơ sở
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày bắt đầu *</td>
              <td className={td} colSpan={3}>
                <input type="date" {...register("ngay_bat_dau")} className={input} />
                {errors.ngay_bat_dau && <p className={errorText}>{errors.ngay_bat_dau.message}</p>}
              </td>
            </tr>

            {initialData?.ngay_ket_thuc && (
              <tr>
                <td className={label}>Ngày kết thúc</td>
                <td className={td} colSpan={3}>
                  <input type="date" {...register("ngay_ket_thuc")} className={input} />
                  <p className="text-[12px] text-gray-600 pl-2 mt-1">
                    Để trống nếu mức lương này vẫn đang hiệu lực (hiện hành)
                  </p>
                  {errors.ngay_ket_thuc && <p className={errorText}>{errors.ngay_ket_thuc.message}</p>}
                </td>
              </tr>
            )}

            <tr>
              <td className={label}>Mức lương cơ sở (VNĐ) *</td>
              <td className={td} colSpan={3}>
                <input
                  type="number"
                  {...register("luong_co_so", { valueAsNumber: true })}
                  className={input}
                  min="1"
                  // step="1000"
                />
                {errors.luong_co_so && <p className={errorText}>{errors.luong_co_so.message}</p>}
              </td>
            </tr>

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 text-[13px] border">
                Lưu ý: Khi tạo mức mới đang hiệu lực, hệ thống sẽ tự động kết thúc mức cũ (nếu có).
              </td>
            </tr>
          </tbody>
        </table>

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
