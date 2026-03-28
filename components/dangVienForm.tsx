"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dangVienSchema, DangVienFormData } from "@/types/dangvien";
import { DangVien } from "@/types/dangvien";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

type Props = {
  initialData: Partial<DangVien> | null;
  onSubmit: (data: Partial<DangVien>) => Promise<any>;
  isNew: string;
};

// ====== UTIL ======
function toDateInput(value?: string | null) {
  if (!value) return null;
  return value.split("T")[0];
}

function toISO(value?: string | null) {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

export default function DangVienForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();

  const form = useForm<DangVienFormData>({
    resolver: zodResolver(dangVienSchema),
    defaultValues: {},
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  // ===== FIELD ARRAY =====
  const {
    fields: ngheFields,
    append: addNghe,
    remove: rmNghe,
  } = useFieldArray({
    control,
    name: "nghe_nghiep",
  });

  const {
    fields: huyFields,
    append: addHuy,
    remove: rmHuy,
  } = useFieldArray({
    control,
    name: "huy_hieu",
  });

  const {
    fields: lsFields,
    append: addLs,
    remove: rmLs,
  } = useFieldArray({
    control,
    name: "lich_su_chuyen_dang",
  });

  // ===== RESET DATA (PARSE DEEP) =====
  useEffect(() => {
    if (!initialData) return;

    form.reset({
      ...initialData,
      email: initialData.email || "",
      la_cam_tinh_dang: initialData.la_cam_tinh_dang ?? false,
      ngay_sinh: toDateInput(initialData.ngay_sinh),
      ngay_vao_dang: toDateInput(initialData.ngay_vao_dang),
      ngay_vao_dang_chinh_thuc: toDateInput(initialData.ngay_vao_dang_chinh_thuc),

      nghe_nghiep:
        initialData.nghe_nghiep?.map((n) => ({
          ...n,
          tu_ngay: toDateInput(n.tu_ngay),
          den_ngay: toDateInput(n.den_ngay),
        })) ?? [],

      huy_hieu:
        initialData.huy_hieu?.map((h) => ({
          ...h,
          ngay_nhan: toDateInput(h.ngay_nhan),
        })) ?? [],

      lich_su_chuyen_dang:
        initialData.lich_su_chuyen_dang?.map((l) => ({
          ...l,
          ngay_chuyen_di: toDateInput(l.ngay_chuyen_di),
          ngay_chuyen_den: toDateInput(l.ngay_chuyen_den),
        })) ?? [],

      thong_tin_khac: initialData.thong_tin_khac
        ? {
            ...initialData.thong_tin_khac,
            ngay_mat: toDateInput(initialData.thong_tin_khac.ngay_mat),
            ngay_ra_dang: toDateInput(initialData.thong_tin_khac.ngay_ra_dang),
          }
        : {
            ngay_mat: null,
            ly_do_mat: "",
            ngay_ra_dang: null,
            hinh_thuc_ra_dang: "",
          },
    });
  }, [initialData]);

  // ===== SUBMIT (CONVERT ISO DEEP) =====
  const submitHandler = async (values: DangVienFormData) => {
    try {
      // Partial<DangVien>
      const cleanedData: any = {
        ...values,

        ngay_sinh: toISO(values.ngay_sinh),
        ngay_vao_dang: toISO(values.ngay_vao_dang),
        ngay_vao_dang_chinh_thuc: toISO(values.ngay_vao_dang_chinh_thuc),

        nghe_nghiep: values.nghe_nghiep?.map((n) => ({
          ...n,
          tu_ngay: toISO(n.tu_ngay),
          den_ngay: toISO(n.den_ngay),
        })),

        huy_hieu: values.huy_hieu?.map((h) => ({
          ...h,
          ngay_nhan: toISO(h.ngay_nhan),
        })),

        lich_su_chuyen_dang: values.lich_su_chuyen_dang?.map((l: any) => ({
          ...l,
          ngay_chuyen_di: toISO(l.ngay_chuyen_di),
          ngay_chuyen_den: toISO(l.ngay_chuyen_den),
        })),

        thong_tin_khac: values.thong_tin_khac
          ? {
              ...values.thong_tin_khac,
              ngay_mat: toISO(values.thong_tin_khac.ngay_mat),
              ngay_ra_dang: toISO(values.thong_tin_khac.ngay_ra_dang),
            }
          : undefined,
      };

      await onSubmit(cleanedData);
      router.push("/dang-vien");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại");
    }
  };
  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px] ";
  const label = "bg-gray-100 font-medium px-2 py-1 border";
  const td = "border px-2 bg-gray-100 py-2";
  return (
    <div className="container text-[13px] mx-auto p-4 bg-white border border-solid border-[#ccc] rounded-[5px]">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-10 pb-12">
        {/* 1. Thông tin cơ bản */}
        <Link href={"/"} className="text-[#0000ff] text-[13px]  font-bold">
          Đảng viên vào đây để xem hướng dẫn chi tiết.
        </Link>
        <div className="w-full mb-px mt-4 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>
        <table className="w-full border-collapse border">
          <tbody>
            <tr>
              <td colSpan={4} className=" font-bold mb-6 text-[14px] bg-[#EDF4F9] pl-2 ">
                Thông tin lý lịch
              </td>
            </tr>

            <tr>
              <td className={label}>Họ và tên *</td>
              <td className={td}>
                <input {...register("ho_ten")} className={input} />
              </td>

              <td className={label}>Họ tên khai sinh</td>
              <td className={td}>
                <input {...register("ho_ten_khai_sinh")} className={input} />
              </td>
            </tr>
            <tr>
              <td className={label}>Ngày sinh</td>
              <td className={td}>
                <input type="date" {...register("ngay_sinh")} className={input} />
              </td>

              <td className={label}>Giới tính</td>
              <td className={td}>
                <select {...register("gioi_tinh")} className={input}>
                  <option value="">Chọn</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className={label}>Email</td>
              <td className={td}>
                <input type="email" {...register("email")} className={input} placeholder="example@gmail.com" />
              </td>

              <td className={label}>Là cảm tình Đảng</td>
              <td className={td}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("la_cam_tinh_dang")} className="w-4 h-4 accent-blue-600" />
                  <span className="text-[13px]">Có</span>
                </label>
              </td>
            </tr>
            <tr>
              <td className={label}>Dân tộc</td>
              <td className={td}>
                <input {...register("dan_toc")} className={input} />
              </td>

              <td className={label}>Tôn giáo</td>
              <td className={td}>
                <input {...register("ton_giao")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Quê quán</td>
              <td className={td} colSpan={3}>
                <input {...register("que_quan")} className={input} />
              </td>
            </tr>
            {/* trình độ */}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 font-semibold border">
                Trình độ
              </td>
            </tr>

            <tr>
              <td className={label}>Văn hóa</td>
              <td className={td}>
                <input {...register("trinh_do.van_hoa")} className={input} />
              </td>

              <td className={label}>Lý luận</td>
              <td className={td}>
                <input {...register("trinh_do.ly_luan")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Ngoại ngữ</td>
              <td className={td}>
                <input {...register("trinh_do.ngoai_ngu")} className={input} />
              </td>

              <td className={label}>Chuyên môn</td>
              <td className={td}>
                <input {...register("trinh_do.chuyen_mon")} className={input} />
              </td>
            </tr>

            {/* ===== NGHỀ NGHIỆP ===== */}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                <div className="flex justify-between items-center">
                  Nghề nghiệp
                  <button
                    type="button"
                    onClick={() => addNghe({ ten_nghe: "", tu_ngay: null, den_ngay: null })}
                    className="text-[#515151] hover:bg-white/10 bg-[#F7F7F7] border-[#243f50] border hover:opacity-75 cursor-pointer px-3 py-0.5 text-xs rounded"
                  >
                    + Thêm
                  </button>
                </div>
              </td>
            </tr>

            {/* header nhỏ */}
            <tr>
              <td className={`${td} border px-2 py-1 text-center font-medium `}>Tên nghề</td>
              <td className={`${td} border px-2 py-1 text-center font-medium `}>Từ ngày</td>
              <td className={`${td} border px-2 py-1 text-center font-medium `}>Đến ngày</td>
              <td className={`${td} border px-2 py-1 text-center font-medium `}>Hành động</td>
            </tr>

            {/* data */}
            {ngheFields.map((field, idx) => (
              <tr key={field.id}>
                <td className={`${td} border px-2 py-1`}>
                  <input {...register(`nghe_nghiep.${idx}.ten_nghe`)} className={` ${input} w-full border px-2 py-1`} />
                </td>

                <td className={`${td} border px-2 py-1`}>
                  <input
                    type="date"
                    {...register(`nghe_nghiep.${idx}.tu_ngay`)}
                    className={` ${input} w-full border px-2 py-1`}
                  />
                </td>

                <td className={`${td} border px-2 py-1`}>
                  <input
                    type="date"
                    {...register(`nghe_nghiep.${idx}.den_ngay`)}
                    className={` ${input} w-full border px-2 py-1`}
                  />
                </td>

                <td className="border px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => rmNghe(idx)}
                    className="bg-[#F7F7F7] cursor-pointer text-[#515151] hover:bg-white/10 transition-all duration-300 border  border-[#243f50] hover:opacity-75 px-2 py-1 rounded text-xs"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {/* ===== ĐẢNG ===== */}
            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 font-semibold border">
                Thông tin Đảng viên
              </td>
            </tr>

            <tr>
              <td className={label}>Số thẻ</td>
              <td className={td}>
                <input {...register("so_the_dang_vien")} className={input} />
              </td>

              <td className={label}>Ngày vào Đảng</td>
              <td className={td}>
                <input type="date" {...register("ngay_vao_dang")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày chính thức</td>
              <td className={td}>
                <input type="date" {...register("ngay_vao_dang_chinh_thuc")} className={input} />
              </td>

              <td className={label}>Đối tượng</td>
              <td className={td}>
                <input {...register("doi_tuong")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Trạng thái quân đội</td>
              <td className={td}>
                <input {...register("trang_thai_quan_doi")} className={input} />
              </td>

              <td className={label}>Hưu trí</td>
              <td className={td}>
                <input {...register("tinh_trang_huu_tri")} className={input} />
              </td>
            </tr>

            {/* ===== HUY HIỆU ===== */}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                <div className="flex justify-between items-center">
                  Huy hiệu
                  <button
                    type="button"
                    onClick={() => addHuy({ loai: "", ngay_nhan: null })}
                    className="text-[#515151] hover:bg-white/10 bg-[#F7F7F7] border-[#243f50] border hover:opacity-75 cursor-pointer px-3 py-0.5 text-xs rounded"
                  >
                    + Thêm
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td className={`${td} border px-2 py-1 text-center font-medium`}>Loại</td>
              <td className={`${td} border px-2 py-1 text-center font-medium`}>Ngày nhận</td>
              <td colSpan={2} className={`${td} border px-2 py-1 text-center font-medium`}>
                Hành động
              </td>
            </tr>

            {huyFields.map((field, idx) => (
              <tr key={field.id}>
                <td className={`${td} border px-2 py-1`}>
                  <input {...register(`huy_hieu.${idx}.loai`)} className={`${input} w-full border px-2 py-1`} />
                </td>

                <td className={`${td} border px-2 py-1`}>
                  <input
                    type="date"
                    {...register(`huy_hieu.${idx}.ngay_nhan`)}
                    className={`${input} w-full border px-2 py-1`}
                  />
                </td>

                <td colSpan={2} className="border px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => rmHuy(idx)}
                    className="text-[#515151] hover:bg-white/10 transition-all duration-300 border  border-[#243f50] p-1.25 bg-[#F7F7F7] px-2 py-1 text-xs rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {huyFields.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 border py-2">
                  Chưa có huy hiệu
                </td>
              </tr>
            )}

            {/* ===== LỊCH SỬ CHUYỂN ĐẢNG ===== */}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                <div className="flex justify-between items-center">
                  Lịch sử chuyển Đảng
                  <button
                    type="button"
                    onClick={() => addLs({ ngay_chuyen_di: null, noi_di: "", ngay_chuyen_den: null, noi_den: "" })}
                    className="text-[#515151] hover:bg-white/10 bg-[#F7F7F7] border-[#243f50] border hover:opacity-75 cursor-pointer px-3 py-0.5 text-xs rounded"
                  >
                    + Thêm
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td className={`${td} border px-2 py-1 text-center font-medium`}>Ngày đi</td>
              <td className={`${td} border px-2 py-1 text-center font-medium`}>Nơi đi</td>
              <td className={`${td} border px-2 py-1 text-center font-medium`}>Ngày đến</td>
              <td className={`${td} border px-2 py-1 text-center font-medium`}>Nơi đến / Xóa</td>
            </tr>

            {lsFields.map((field, idx) => (
              <tr key={field.id}>
                <td className={`${td} border px-2 py-1`}>
                  <input
                    type="date"
                    {...register(`lich_su_chuyen_dang.${idx}.ngay_chuyen_di`)}
                    className="w-full border px-2 py-1"
                  />
                </td>

                <td className={`${td} border px-2 py-1`}>
                  <input
                    {...register(`lich_su_chuyen_dang.${idx}.noi_di`)}
                    className={`${input} w-full border px-2 py-1`}
                  />
                </td>

                <td className={`${td} border px-2 py-1`}>
                  <input
                    type="date"
                    {...register(`lich_su_chuyen_dang.${idx}.ngay_chuyen_den`)}
                    className="w-full border px-2 py-1"
                  />
                </td>

                <td className={`${td} border px-2 py-1`}>
                  <div className="flex gap-2">
                    <input
                      {...register(`lich_su_chuyen_dang.${idx}.noi_den`)}
                      className={`${input} w-full border px-2 py-1`}
                    />
                    <button
                      type="button"
                      onClick={() => rmLs(idx)}
                      className="text-[#515151] hover:bg-white/10 transition-all duration-300 border  border-[#243f50] p-1.25 bg-[#F7F7F7] px-2 py-1 text-xs rounded"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {lsFields.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 border py-2">
                  Chưa có lịch sử
                </td>
              </tr>
            )}

            {/* ===== THÔNG TIN KHÁC ===== */}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                Thông tin khác
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày mất</td>
              <td className={td}>
                <input type="date" {...register("thong_tin_khac.ngay_mat")} className={input} />
              </td>

              <td className={label}>Lý do mất</td>
              <td className={td}>
                <input {...register("thong_tin_khac.ly_do_mat")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày ra Đảng</td>
              <td className={td}>
                <input type="date" {...register("thong_tin_khac.ngay_ra_dang")} className={input} />
              </td>

              <td className={label}>Hình thức</td>
              <td className={td}>
                <input {...register("thong_tin_khac.hinh_thuc_ra_dang")} className={input} />
              </td>
            </tr>

            {/* ===== GHI CHÚ ===== */}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                Ghi chú
              </td>
            </tr>

            <tr>
              <td colSpan={4} className="border px-2 py-2">
                <textarea
                  {...register("ghi_chu")}
                  rows={4}
                  className="w-full border px-2 py-1"
                  placeholder="Ghi chú thêm..."
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
            className="px-8 py-3 cursor-pointer hover:opacity-75 rounded-lg  underline border-[#80B5D7] text-[14px]"

            // className="px-8 py-3  cursor-pointer text-white hover:opacity-75  rounded-lg  bg-[#3872B2] border border-[#80B5D7] text-[14px] font-bold"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className=" bg-[#3872B2] border  cursor-pointer hover:opacity-75 border-[#80B5D7] text-[14px] font-bold  px-10 py-3  text-white rounded-lg  disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
