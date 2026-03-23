const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api";

export const fetchCuocthidangkyList = async () => {
  const res = await fetch(`${BASE_URL}/contest-registrations`);
  if (!res.ok) throw new Error("Không tải được danh sách");
  return res.json();
};

export const fetchCuocthidangkyById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/contest-registrations/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy đăng ký");
  return res.json();
};

export const createCuocthidangky = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/contest-registrations`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Tạo thất bại");
  }
  return res.json();
};

export const updateCuocthidangky = async (id: string, formData: FormData) => {
  const res = await fetch(`${BASE_URL}/contest-registrations/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Cập nhật thất bại");
  }
  return res.json();
};

export const deleteCuocthidangky = async (id: string) => {
  const res = await fetch(`${BASE_URL}/contest-registrations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa thất bại");
  return res.json();
};
