export interface LuongCoSo {
  _id: string;
  ngay_bat_dau: string; // ISO string từ backend
  ngay_ket_thuc: string | null;
  luong_co_so: number;
  createdAt?: string;
  updatedAt?: string;
}
