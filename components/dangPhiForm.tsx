"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DangPhi } from "@/types/dangphi";
import { DangVienPhi } from "@/types/dangvienphi"; // import để hiển thị tên

import { fetchDangVienPhiList } from "@/lib/dangvienphi"; // cần thêm hàm này vào lib/api.ts

const formSchema = z.object({
  dangvien_phi_id: z.string().min(1, "Vui lòng chọn đảng viên"),
  thang: z.number().min(1).max(12, "Tháng từ 1 đến 12"),
  nam: z.number().min(2000, "Năm phải >= 2000").max(2100, "Năm không hợp lý"),
  truy_thu: z.number().min(0, "Truy thu phải >= 0").optional(),
  da_thu: z.number().min(0, "Đã thu phải >= 0").optional(),
});

type DangPhiFormData = z.infer<typeof formSchema>;

type Props = {
  initialData: Partial<DangPhi> | null;
  onSubmit: (data: Partial<DangPhi>) => Promise<any>;
  isNew: string;
};

export default function DangPhiForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();

  const [dangVienPhis, setDangVienPhis] = useState<DangVienPhi[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Giả sử bạn đã thêm hàm fetchDangVienPhiList vào lib/api.ts
        const list = await fetchDangVienPhiList();
        setDangVienPhis(list);
      } catch (err) {
        console.error("Lỗi tải danh sách đảng viên phí:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DangPhiFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dangvien_phi_id: "",
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear(),
      truy_thu: 0,
      da_thu: 0,
    },
  });
  useEffect(() => {
    if (initialData) {
      reset({
        dangvien_phi_id: (initialData.dangvien_phi_id as any)?._id || "",
        thang: initialData.thang || new Date().getMonth() + 1,
        nam: initialData.nam || new Date().getFullYear(),
        truy_thu: initialData.truy_thu || 0,
        da_thu: initialData.da_thu || 0,
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (values: DangPhiFormData) => {
    try {
      const dvp = dangVienPhis.find((d) => d._id === values.dangvien_phi_id);

      const payload: Partial<DangPhi> = {
        thang: Number(values.thang),
        nam: Number(values.nam),
        truy_thu: Number(values.truy_thu || 0),
        da_thu: Number(values.da_thu || 0),

        dangvien_phi_id: {
          _id: values.dangvien_phi_id,
          dang_vien_id: {
            ho_ten: dvp?.dang_vien_id?.ho_ten || "",
            so_the_dang_vien: dvp?.dang_vien_id?.so_the_dang_vien || "",
          },
          ma_ngach: dvp?.ma_ngach || "",
          bac: dvp?.bac || 1,
        },
      };

      await onSubmit(payload);
      router.push("/dang-phi");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border text-[13px]";
  const td = "border px-2 bg-gray-100 py-2 text-[13px]";
  const errorText = "text-red-600 text-[12px] pl-2";
  const select = `${input} appearance-none bg-white`;

  if (loadingOptions) {
    return <div className="p-6">Đang tải danh sách đảng viên phí...</div>;
  }

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
                Thông tin đảng phí tháng
              </td>
            </tr>

            <tr>
              <td className={label}>Đảng viên *</td>
              <td className={td} colSpan={3}>
                <select {...register("dangvien_phi_id")} className={select} disabled={!isNew}>
                  <option value="">-- Chọn đảng viên --</option>
                  {dangVienPhis.map((dvp) => (
                    <option key={dvp._id} value={dvp._id}>
                      {dvp.dang_vien_id?.ho_ten || "Không tên"} -{" "}
                      {dvp.dang_vien_id?.so_the_dang_vien || "Chưa có số thẻ"}
                    </option>
                  ))}
                </select>
                {errors.dangvien_phi_id && <p className={errorText}>{errors.dangvien_phi_id.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Tháng *</td>
              <td className={td}>
                <select {...register("thang", { valueAsNumber: true })} className={select}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {errors.thang && <p className={errorText}>{errors.thang.message}</p>}
              </td>

              <td className={label}>Năm *</td>
              <td className={td}>
                <input
                  type="number"
                  {...register("nam", { valueAsNumber: true })}
                  className={input}
                  min="2000"
                  max="2100"
                />
                {errors.nam && <p className={errorText}>{errors.nam.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Truy thu (nếu có)</td>
              <td className={td} colSpan={3}>
                <input
                  type="number"
                  step="any"
                  {...register("truy_thu", { valueAsNumber: true })}
                  className={input}
                  min="0"
                />
                {errors.truy_thu && <p className={errorText}>{errors.truy_thu.message}</p>}
              </td>
            </tr>
            <tr>
              <td className={label}>Đã thu (nếu có)</td>
              <td className={td} colSpan={3}>
                <input
                  type="number"
                  step="0.000001"
                  {...register("da_thu", { valueAsNumber: true })}
                  className={input}
                  min="0"
                />
                {errors.da_thu && <p className={errorText}>{errors.da_thu.message}</p>}
              </td>
            </tr>
            {/* Thông tin tự động tính - hiển thị khi edit */}
            {!isNew && initialData && (
              <>
                <tr>
                  <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                    Thông tin tự động tính (không chỉnh sửa)
                  </td>
                </tr>

                <tr>
                  <td className={label}>Thu nhập</td>
                  <td className={td} colSpan={3}>
                    {initialData.thu_nhap?.toLocaleString("vi-VN")} đ
                  </td>
                </tr>

                <tr>
                  <td className={label}>Đảng phí (1%)</td>
                  <td className={td} colSpan={3}>
                    {initialData.dang_phi?.toLocaleString("vi-VN")} đ
                  </td>
                </tr>

                <tr>
                  <td className={label}>Tổng đảng phí</td>
                  <td className={td} colSpan={3}>
                    {initialData.tong_dang_phi?.toLocaleString("vi-VN")} đ
                  </td>
                </tr>
              </>
            )}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 text-[13px] border">
                Lưu ý: Thu nhập, đảng phí sẽ được hệ thống tự tính dựa trên thông tin lương và phụ cấp của đảng viên.
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
