"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicantSchema, ApplicantFormData } from "@/types/applicant";
import { Applicant } from "@/lib/applicant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  initialData: Partial<Applicant> | null;
  onSubmit: (formData: FormData) => Promise<any>;
  isNew: string;
};

export default function ApplicantForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null); // tạm chỉ hỗ trợ 1 file ví dụ

  const form = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      name: "",
      dob: "",
      gender: undefined,
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
      dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
      gender: initialData.gender as any,
    });
  }, [initialData, reset]);

  const submitHandler = handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(values));

    // Nếu có file (ví dụ upload CV hoặc ảnh đại diện – tùy bạn mở rộng)
    if (file) {
      formData.append("file", file); // backend hiện chưa xử lý file ở create/update applicant
    }

    try {
      await onSubmit(formData);
      router.push("/applicants");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + err.message);
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
                Thông tin hồ sơ cảm tình Đảng
              </td>
            </tr>

            <tr>
              <td className={label}>Họ và tên *</td>
              <td className={td} colSpan={3}>
                <input {...register("name")} className={input} />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày sinh</td>
              <td className={td}>
                <input type="date" {...register("dob")} className={input} />
              </td>

              <td className={label}>Giới tính</td>
              <td className={td}>
                <select {...register("gender")} className={input}>
                  <option value="">Chọn</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

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
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
