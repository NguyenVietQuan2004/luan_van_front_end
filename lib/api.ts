import { DangVien } from "@/types/dangvien";

// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api";
export async function fetchDangVienList(): Promise<DangVien[]> {
  const res = await fetch(`${API_BASE}/dang-vien`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được danh sách");
  return res.json();
}

export async function fetchDangVienById(id: string): Promise<DangVien> {
  const res = await fetch(`${API_BASE}/dang-vien/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy đảng viên");
  return res.json();
}

export async function createDangVien(data: Partial<DangVien>): Promise<DangVien> {
  const res = await fetch(`${API_BASE}/dang-vien`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Tạo thất bại");
  return res.json();
}

export async function updateDangVien(id: string, data: Partial<DangVien>): Promise<DangVien> {
  const res = await fetch(`${API_BASE}/dang-vien/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cập nhật thất bại");
  return res.json();
}

export async function deleteDangVien(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/dang-vien/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa thất bại");
}
