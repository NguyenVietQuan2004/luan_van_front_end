// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api";

export const fetchCuocthiList = async () => {
  const res = await fetch(`${BASE_URL}/contests`);
  if (!res.ok) throw new Error("Không tải được danh sách");
  return res.json();
};

export const fetchCuocthiById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/contests/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy cuộc thi");
  return res.json();
};

export const createCuocthi = async (data: any) => {
  const res = await fetch(`${BASE_URL}/contests`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Tạo thất bại");
  }
  return res.json();
};

export const updateCuocthi = async (id: string, data: FormData) => {
  const res = await fetch(`${BASE_URL}/contests/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Cập nhật thất bại");
  }
  return res.json();
};

export const deleteCuocthi = async (id: string) => {
  const res = await fetch(`${BASE_URL}/contests/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa thất bại");
  return res.json();
};
