"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReportFormData, reportSchema } from "@/types/report";
import { fetchReportCodes } from "@/lib/report";

type Props = {
  initialData: any;
  onSubmit: (formData: FormData) => Promise<any>;
  isNew: string;
};

export default function ReportForm({ initialData = null, onSubmit, isNew }: Props) {
  const router = useRouter();
  const [availableCodes, setAvailableCodes] = useState<any[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      code_id: "",
      title: "",
      ngay_ban_hanh: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = form;

  // Load danh sách ReportCode
  useEffect(() => {
    const loadCodes = async () => {
      setLoadingCodes(true);
      try {
        const data = await fetchReportCodes();
        setAvailableCodes(data);
      } catch (err) {
        console.error("Không tải được danh sách mã báo cáo", err);
      } finally {
        setLoadingCodes(false);
      }
    };

    loadCodes();
  }, []);

  // Reset form khi edit
  useEffect(() => {
    if (initialData) {
      reset({
        code_id: initialData.code_id?._id || initialData.code_id || "",
        title: initialData.title || "",
        ngay_ban_hanh: initialData.ngay_ban_hanh ? initialData.ngay_ban_hanh.split("T")[0] : "",
      });
    }
  }, [initialData, reset]);

  const submitHandler = handleSubmit(async (values) => {
    const formData = new FormData();

    const jsonData = {
      code_id: values.code_id,
      title: values.title,
      ngay_ban_hanh: values.ngay_ban_hanh,
    };

    formData.append("data", JSON.stringify(jsonData));

    // Nếu có file được chọn (input type file)
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("file", fileInput.files[0]);
    }

    try {
      await onSubmit(formData);
      router.push("/reports");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + err.message);
    }
  });

  const selectedCodeId = watch("code_id");
  const selectedCode = availableCodes.find((c) => c._id === selectedCodeId);

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border";

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
                Thông tin báo cáo
              </td>
            </tr>

            <tr>
              <td className={label}>Mã báo cáo *</td>
              <td className="border px-2 py-2" colSpan={3}>
                {loadingCodes ? (
                  <p className="text-gray-500 py-1">Đang tải danh sách mã...</p>
                ) : (
                  <select {...register("code_id")} className={input}>
                    <option value="">-- Chọn mã báo cáo --</option>
                    {availableCodes.map((code) => (
                      <option key={code._id} value={code._id}>
                        {code.code} - {code.name} ({code.type_id?.name})
                      </option>
                    ))}
                  </select>
                )}
                {errors.code_id && <p className="text-red-600 text-xs mt-1">{errors.code_id.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Tiêu đề *</td>
              <td className="border px-2 py-2" colSpan={3}>
                <input {...register("title")} className={input} />
                {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày ban hành</td>
              <td className="border px-2 py-2" colSpan={3}>
                <input type="date" {...register("ngay_ban_hanh")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>File đính kèm</td>
              <td className="border px-2 py-2" colSpan={3}>
                <input type="file" id="file" className="text-sm" />
                {initialData?.file_name && (
                  <p className="text-xs text-gray-500 mt-1">
                    File hiện tại: <span className="font-medium">{initialData.file_name}</span>
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
            {isSubmitting ? "Đang gửi..." : "Lưu báo cáo"}
          </button>
        </div>
      </form>
    </div>
  );
}
