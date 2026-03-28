"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchReportTypes } from "@/lib/report";

const reportCodeSchema = z.object({
  name: z.string().min(1, "Tên mã báo cáo không được để trống"),
  code: z.string().min(1, "Mã không được để trống").toUpperCase(),
  type_id: z.string().min(1, "Vui lòng chọn loại báo cáo"),
});

type ReportCodeFormData = z.infer<typeof reportCodeSchema>;

type Props = {
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<any>;
  isNew: string;
};

export default function ReportCodeForm({ initialData = null, onSubmit, isNew }: Props) {
  const router = useRouter();
  const [reportTypes, setReportTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const form = useForm<ReportCodeFormData>({
    resolver: zodResolver(reportCodeSchema),
    defaultValues: {
      name: "",
      code: "",
      type_id: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = form;

  // Load danh sách ReportType
  useEffect(() => {
    const loadTypes = async () => {
      setLoadingTypes(true);
      try {
        const data = await fetchReportTypes();
        setReportTypes(data);
      } catch (err) {
        console.error("Không tải được danh sách loại báo cáo", err);
      } finally {
        setLoadingTypes(false);
      }
    };
    loadTypes();
  }, []);

  // Reset form khi edit
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        code: initialData.code || "",
        type_id: initialData.type_id?._id || initialData.type_id || "",
      });
    }
  }, [initialData, reset]);

  const submitHandler = handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(values));

    // Thêm file template nếu có
    const fileInput = document.getElementById("template_file") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("file", fileInput.files[0]);
    }

    try {
      await onSubmit(formData);
      router.push("/reports/codes");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + err.message);
    }
  });

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border";

  return (
    <div className="container text-[13px] mx-auto p-4 bg-white border border-solid border-[#ccc] rounded-[5px] max-w-3xl">
      <form onSubmit={submitHandler} className="space-y-10 pb-12">
        <div className="w-full mb-px mt-4 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>

        <table className="w-full border-collapse border">
          <tbody>
            <tr>
              <td colSpan={4} className="font-bold text-[14px] bg-[#EDF4F9] pl-2 py-1">
                Thông tin mã báo cáo
              </td>
            </tr>

            <tr>
              <td className={label}>Loại báo cáo *</td>
              <td className="border px-2 py-2" colSpan={3}>
                {loadingTypes ? (
                  <p className="text-gray-500">Đang tải danh sách loại...</p>
                ) : (
                  <select {...register("type_id")} className={input}>
                    <option value="">-- Chọn loại báo cáo --</option>
                    {reportTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.type_id && <p className="text-red-600 text-xs mt-1">{errors.type_id.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Mã *</td>
              <td className="border px-2 py-2">
                <input {...register("code")} className={input} placeholder="Ví dụ: BC-DU, NQ-DU" />
                {errors.code && <p className="text-red-600 text-xs mt-1">{errors.code.message}</p>}
              </td>

              <td className={label}>Tên mã báo cáo *</td>
              <td className="border px-2 py-2">
                <input {...register("name")} className={input} placeholder="Ví dụ: Báo cáo công tác Đảng ủy" />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>File template</td>
              <td className="border px-2 py-2" colSpan={3}>
                <input type="file" id="template_file" className="text-sm" />
                {initialData?.template_file && (
                  <p className="text-xs text-gray-500 mt-1">
                    File template hiện tại:{" "}
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${initialData.template_file}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {initialData.template_file.split("/").pop()}
                    </a>
                  </p>
                )}
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
            {isSubmitting ? "Đang lưu..." : "Lưu mã báo cáo"}
          </button>
        </div>
      </form>
    </div>
  );
}
