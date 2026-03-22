export interface MienDangPhi {
  tu_ngay: string;
  den_ngay: string | null;
  ly_do: string;
}

export interface DangVienPhi {
  _id: string;
  ma_cb: string;
  ma_cc: string;
  dang_vien_id: {
    _id: string;
    ho_ten: string;
    so_the_dang_vien: string;
    ngay_sinh?: string;
    gioi_tinh?: string;
  };
  ma_ngach: string;
  bac: number;
  hs_pccv: number;
  pc_tham_nien_nha_giao: number;
  pc_tham_nien_vuot_khung: number;
  mien_dang_phi: MienDangPhi[];
  createdAt?: string;
  updatedAt?: string;
}
