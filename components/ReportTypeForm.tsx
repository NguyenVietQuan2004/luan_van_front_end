"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const reportTypeSchema = z.object({
  name: z.string().min(1, "Tên loại báo cáo không được để trống"),
});

type ReportTypeFormData = z.infer<typeof reportTypeSchema>;

type Props = {
  initialData?: any;
  onSubmit: (formData: any) => Promise<any>; // nhận object thay vì FormData vì không có file
  isNew: string;
};

export default function ReportTypeForm({ initialData = null, onSubmit, isNew }: Props) {
  const router = useRouter();

  const form = useForm<ReportTypeFormData>({
    resolver: zodResolver(reportTypeSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  // Reset form khi edit
  useEffect(() => {
    if (initialData?.name) {
      reset({ name: initialData.name });
    }
  }, [initialData, reset]);

  const submitHandler = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      router.push("/reports/types");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + err.message);
    }
  });

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border";

  return (
    <div className="container text-[13px] mx-auto p-4 bg-white border border-solid border-[#ccc] rounded-[5px] max-w-2xl">
      <form onSubmit={submitHandler} className="space-y-10 pb-12">
        <div className="w-full mb-px mt-4 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>

        <table className="w-full border-collapse border">
          <tbody>
            <tr>
              <td colSpan={2} className="font-bold text-[14px] bg-[#EDF4F9] pl-2 py-1">
                Thông tin loại báo cáo
              </td>
            </tr>

            <tr>
              <td className={label}>Tên loại báo cáo *</td>
              <td className="border px-2 py-2">
                <input {...register("name")} className={input} placeholder="Ví dụ: Báo cáo định kỳ, Nghị quyết..." />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 cursor-pointer hover:opacity-75 rounded-lg underline border-[#80B5D7] text-[14px]"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#3872B2] border cursor-pointer hover:opacity-75 border-[#80B5D7] text-[14px] font-bold px-10 py-3 text-white rounded-lg disabled:opacity-60"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu loại báo cáo"}
          </button>
        </div>
      </form>
    </div>
  );
}
