// types/dangvien.ts
export interface NgheNghiep {
  ten_nghe: string;
  tu_ngay?: string | null; // ISO string hoặc null
  den_ngay?: string | null;
}

export interface HuyHieu {
  loai: string;
  ngay_nhan?: string | null;
}

export interface LichSuChuyenDang {
  ngay_chuyen_di?: string | null;
  noi_den: string;
  ngay_chuyen_den?: string | null;
  noi_di: string;
}

export interface ThongTinKhac {
  ngay_mat?: string | null;
  ly_do_mat?: string;
  ngay_ra_dang?: string | null;
  hinh_thuc_ra_dang?: string;
}

export interface TrinhDo {
  van_hoa: string;
  ly_luan: string;
  ngoai_ngu: string;
  chuyen_mon: string;
}

export interface DangVien {
  _id: string;
  so_tt?: number;
  ho_ten: string;
  ho_ten_khai_sinh?: string;
  ngay_sinh?: string; // ISO date string
  gioi_tinh?: string;
  dan_toc?: string;
  ton_giao?: string;
  que_quan?: string;
  trinh_do?: TrinhDo;
  nghe_nghiep?: NgheNghiep[];
  so_the_dang_vien?: string;
  ngay_vao_dang?: string;
  ngay_vao_dang_chinh_thuc?: string;
  huy_hieu?: HuyHieu[];
  doi_tuong?: string;
  trang_thai_quan_doi?: string;
  tinh_trang_huu_tri?: string;
  lich_su_chuyen_dang?: LichSuChuyenDang[];
  thong_tin_khac?: ThongTinKhac;
  ghi_chu?: string;
  createdAt?: string;
  updatedAt?: string;
}

// types/dangvien.schema.ts (nên dùng cái này)
import { z } from "zod";

const nullableDate = z
  .string()
  .nullable()
  .refine((val) => val === null || val === "" || !isNaN(Date.parse(val)), {
    message: "Ngày không hợp lệ",
  });

const trinhDoSchema = z.object({
  van_hoa: z.string().optional(),
  ly_luan: z.string().optional(),
  ngoai_ngu: z.string().optional(),
  chuyen_mon: z.string().optional(),
});

const ngheNghiepSchema = z.object({
  ten_nghe: z.string().min(1, "Tên nghề bắt buộc"),
  tu_ngay: nullableDate,
  den_ngay: nullableDate,
});

const huyHieuSchema = z.object({
  loai: z.string().min(1, "Loại huy hiệu bắt buộc"),
  ngay_nhan: nullableDate,
});

const lichSuChuyenDangSchema = z.object({
  ngay_chuyen_di: nullableDate,
  noi_di: z.string().optional(),
  ngay_chuyen_den: nullableDate,
  noi_den: z.string().optional(),
});

const thongTinKhacSchema = z.object({
  ngay_mat: nullableDate,
  ly_do_mat: z.string().optional(),
  ngay_ra_dang: nullableDate,
  hinh_thuc_ra_dang: z.string().optional(),
});

export const dangVienSchema = z.object({
  so_tt: z.number().int().positive().optional(),
  ho_ten: z.string().min(1, "Họ tên bắt buộc"),
  ho_ten_khai_sinh: z.string().optional(),
  ngay_sinh: nullableDate.optional(),
  gioi_tinh: z.string().optional(),
  dan_toc: z.string().optional(),
  ton_giao: z.string().optional(),
  que_quan: z.string().optional(),

  trinh_do: trinhDoSchema.optional(),

  nghe_nghiep: z.array(ngheNghiepSchema).optional(),
  so_the_dang_vien: z.string().optional(),
  ngay_vao_dang: nullableDate.optional(),
  ngay_vao_dang_chinh_thuc: nullableDate.optional(),

  huy_hieu: z.array(huyHieuSchema).optional(),

  doi_tuong: z.string().optional(),
  trang_thai_quan_doi: z.string().optional(),
  tinh_trang_huu_tri: z.string().optional(),

  lich_su_chuyen_dang: z.array(lichSuChuyenDangSchema).optional(),

  thong_tin_khac: thongTinKhacSchema.optional(),

  ghi_chu: z.string().optional(),
});

export type DangVienFormData = z.infer<typeof dangVienSchema>;
