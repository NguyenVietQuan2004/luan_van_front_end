export interface DangPhi {
  _id: string;
  dangvien_phi_id: {
    _id: string;
    dang_vien_id: {
      ho_ten: string;
      so_the_dang_vien: string;
    };
    ma_ngach: string;
    bac: number;
  };
  thang: number;
  nam: number;
  thu_nhap: number;
  dang_phi: number;
  truy_thu: number;
  da_thu: number;
  tong_dang_phi: number;
  createdAt?: string;
  updatedAt?: string;
}
