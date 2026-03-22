"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DangVienPhi, MienDangPhi } from "@/types/dangvienphi";
import { DangVien } from "@/types/dangvien";
import { HeSoLuong } from "@/types/hesoluong";

import { fetchDangVienList } from "@/lib/api";
import { fetchHeSoLuongList } from "@/lib/hesoluong"; // thêm dòng này

const mienDangPhiSchema = z.object({
  tu_ngay: z.string().min(1, "Từ ngày không được để trống"),
  den_ngay: z.string().nullable().optional(),
  ly_do: z.string(),
});

const formSchema = z.object({
  ma_cb: z.string().min(1, "Mã cán bộ không được để trống"),
  ma_cc: z.string().min(1, "Mã công chức không được để trống"),
  dang_vien_id: z.string().min(1, "Vui lòng chọn đảng viên"),
  ma_ngach: z.string().min(1, "Vui lòng chọn mã ngạch"),
  bac: z.number().int().positive("Vui lòng chọn bậc"),
  hs_pccv: z.number().min(0),
  pc_tham_nien_nha_giao: z.number().min(0),
  pc_tham_nien_vuot_khung: z.number().min(0),
  mien_dang_phi: z.array(mienDangPhiSchema).optional(),
});

type DangVienPhiFormData = z.infer<typeof formSchema>;

type Props = {
  initialData: Partial<DangVienPhi> | null;
  onSubmit: (data: Partial<DangVienPhi>) => Promise<any>;
  isNew: string;
};

export default function DangVienPhiForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();

  const [dangViens, setDangViens] = useState<DangVien[]>([]);
  const [heSoLuongs, setHeSoLuongs] = useState<HeSoLuong[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Lấy danh sách đảng viên + hệ số lương khi mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [dvList, hslList] = await Promise.all([fetchDangVienList(), fetchHeSoLuongList()]);
        setDangViens(dvList);
        setHeSoLuongs(hslList);
      } catch (err) {
        console.error("Lỗi tải options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const form = useForm<DangVienPhiFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ma_cb: "",
      ma_cc: "",
      dang_vien_id: "",
      ma_ngach: "",
      bac: 0,
      hs_pccv: 0,
      pc_tham_nien_nha_giao: 0,
      pc_tham_nien_vuot_khung: 0,
      mien_dang_phi: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const { fields: mienFields, append: addMien, remove: rmMien } = useFieldArray({ control, name: "mien_dang_phi" });

  // Watch các giá trị để xử lý logic động
  const selectedMaNgach = watch("ma_ngach");
  const selectedBac = watch("bac");

  // Reset bậc khi thay đổi mã ngạch
  useEffect(() => {
    setValue("bac", 0); // reset bậc về mặc định
  }, [selectedMaNgach, setValue]);

  // Điền dữ liệu khi edit
  useEffect(() => {
    if (initialData) {
      form.reset({
        ma_cb: initialData.ma_cb || "",
        ma_cc: initialData.ma_cc || "",
        dang_vien_id: (initialData.dang_vien_id as any)?._id || "",
        ma_ngach: initialData.ma_ngach || "",
        bac: initialData.bac || 0,
        hs_pccv: initialData.hs_pccv || 0,
        pc_tham_nien_nha_giao: initialData.pc_tham_nien_nha_giao || 0,
        pc_tham_nien_vuot_khung: initialData.pc_tham_nien_vuot_khung || 0,
        mien_dang_phi:
          initialData.mien_dang_phi?.map((m: MienDangPhi) => ({
            tu_ngay: m.tu_ngay ? new Date(m.tu_ngay).toISOString().split("T")[0] : "",
            den_ngay: m.den_ngay ? new Date(m.den_ngay).toISOString().split("T")[0] : null,
            ly_do: m.ly_do || "",
          })) || [],
      });
    }
  }, [initialData, form]);

  // Lọc bậc theo mã ngạch đã chọn
  const availableBacs = heSoLuongs
    .filter((hsl) => hsl.ma_ngach === selectedMaNgach)
    .map((hsl) => hsl.bac)
    .sort((a, b) => a - b);

  // Tìm hệ số lương tương ứng (để hiển thị nếu cần)
  const currentHeSo = heSoLuongs.find((hsl) => hsl.ma_ngach === selectedMaNgach && hsl.bac === selectedBac);

  const submitHandler = async (values: DangVienPhiFormData) => {
    try {
      const payload: Partial<DangVienPhi> = {
        ...values,
        dang_vien_id: {
          _id: values.dang_vien_id,
          ho_ten: "",
          so_the_dang_vien: "",
        },
        bac: Number(values.bac),
        mien_dang_phi: values.mien_dang_phi?.map((m) => ({
          tu_ngay: new Date(m.tu_ngay).toISOString(),
          den_ngay: m.den_ngay ? new Date(m.den_ngay).toISOString() : null,
          ly_do: m.ly_do,
        })),
      };

      await onSubmit(payload);
      router.push("/dang-vien-phi");
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
    return <div className="p-6">Đang tải danh sách đảng viên và hệ số lương...</div>;
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
                Thông tin đảng viên phí
              </td>
            </tr>

            {/* Đảng viên */}
            <tr>
              <td className={label}>Đảng viên *</td>
              <td className={td} colSpan={3}>
                <select {...register("dang_vien_id")} className={select} disabled={!isNew}>
                  <option value="">-- Chọn đảng viên --</option>
                  {dangViens.map((dv) => (
                    <option key={dv._id} value={dv._id}>
                      {dv.ho_ten} - {dv.so_the_dang_vien || "Chưa có số thẻ"}
                    </option>
                  ))}
                </select>
                {errors.dang_vien_id && <p className={errorText}>{errors.dang_vien_id.message}</p>}
              </td>
            </tr>

            {/* Mã cán bộ & Mã công chức */}
            <tr>
              <td className={label}>Mã cán bộ *</td>
              <td className={td}>
                <input {...register("ma_cb")} className={input} />
                {errors.ma_cb && <p className={errorText}>{errors.ma_cb.message}</p>}
              </td>
              <td className={label}>Mã công chức *</td>
              <td className={td}>
                <input {...register("ma_cc")} className={input} />
                {errors.ma_cc && <p className={errorText}>{errors.ma_cc.message}</p>}
              </td>
            </tr>

            {/* Mã ngạch */}
            <tr>
              <td className={label}>Mã ngạch *</td>
              <td className={td} colSpan={3}>
                <select {...register("ma_ngach")} className={select}>
                  <option value="">-- Chọn mã ngạch --</option>
                  {Array.from(new Set(heSoLuongs.map((hsl) => hsl.ma_ngach))).map((ma) => (
                    <option key={ma} value={ma}>
                      {ma}
                    </option>
                  ))}
                </select>
                {errors.ma_ngach && <p className={errorText}>{errors.ma_ngach.message}</p>}
              </td>
            </tr>

            {/* Bậc */}
            <tr>
              <td className={label}>Bậc *</td>
              <td className={td} colSpan={3}>
                <select {...register("bac", { valueAsNumber: true })} className={select} disabled={!selectedMaNgach}>
                  <option value={0}>-- Chọn bậc --</option>
                  {availableBacs.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.bac && <p className={errorText}>{errors.bac.message}</p>}

                {currentHeSo && (
                  <p className="text-[12px] text-green-700 pl-2 mt-1">
                    Hệ số lương tương ứng: {currentHeSo.he_so_luong.toFixed(2)}
                  </p>
                )}
              </td>
            </tr>

            {/* Các phụ cấp */}
            <tr>
              <td className={label}>HS PCCV</td>
              <td className={td}>
                <input type="number" {...register("hs_pccv", { valueAsNumber: true })} className={input} min="0" />
              </td>
              <td className={label}>PC thâm niên nhà giáo (%)</td>
              <td className={td}>
                <input
                  type="number"
                  {...register("pc_tham_nien_nha_giao", { valueAsNumber: true })}
                  className={input}
                  min="0"
                />
              </td>
            </tr>

            <tr>
              <td className={label}>PC thâm niên vượt khung (%)</td>
              <td className={td} colSpan={3}>
                <input
                  type="number"
                  {...register("pc_tham_nien_vuot_khung", { valueAsNumber: true })}
                  className={input}
                  min="0"
                />
              </td>
            </tr>

            {/* Miễn đảng phí */}
            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                <div className="flex justify-between items-center">
                  Miễn đảng phí
                  <button
                    type="button"
                    onClick={() => addMien({ tu_ngay: "", den_ngay: null, ly_do: "" })}
                    className="text-[#515151] hover:bg-white/10 bg-[#F7F7F7] border-[#243f50] border hover:opacity-75 cursor-pointer px-3 py-0.5 text-xs rounded"
                  >
                    + Thêm miễn
                  </button>
                </div>
              </td>
            </tr>

            {mienFields.length > 0 && (
              <tr>
                <td className={`${td} border px-2 py-1 text-center font-medium`}>Từ ngày</td>
                <td className={`${td} border px-2 py-1 text-center font-medium`}>Đến ngày</td>
                <td className={`${td} border px-2 py-1 text-center font-medium`}>Lý do</td>
                <td className={`${td} border px-2 py-1 text-center font-medium`}>Hành động</td>
              </tr>
            )}

            {mienFields.map((field, idx) => (
              <tr key={field.id}>
                <td className={`${td} border px-2 py-1`}>
                  <input type="date" {...register(`mien_dang_phi.${idx}.tu_ngay`)} className={input} />
                </td>
                <td className={`${td} border px-2 py-1`}>
                  <input type="date" {...register(`mien_dang_phi.${idx}.den_ngay`)} className={input} />
                </td>
                <td className={`${td} border px-2 py-1`}>
                  <input {...register(`mien_dang_phi.${idx}.ly_do`)} className={input} placeholder="Lý do miễn" />
                </td>
                <td className={`${td} border px-2 py-1 text-center`}>
                  <button type="button" onClick={() => rmMien(idx)} className="text-red-600 hover:text-red-800 text-xs">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
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
