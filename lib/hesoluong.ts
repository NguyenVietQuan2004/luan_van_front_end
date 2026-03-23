// lib/api.ts  (tiếp nối phần đảng viên)

import { HeSoLuong } from "@/types/hesoluong";
const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api";

export async function fetchHeSoLuongList(): Promise<HeSoLuong[]> {
  const res = await fetch(`${API_BASE}/hesoluong`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được danh sách hệ số lương");
  return res.json();
}

export async function fetchHeSoLuongById(id: string): Promise<HeSoLuong> {
  const res = await fetch(`${API_BASE}/hesoluong/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy hệ số lương");
  return res.json();
}

export async function createHeSoLuong(data: Partial<HeSoLuong>): Promise<HeSoLuong> {
  const res = await fetch(`${API_BASE}/hesoluong`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Tạo thất bại");
  }
  return res.json();
}

export async function updateHeSoLuong(id: string, data: Partial<HeSoLuong>): Promise<HeSoLuong> {
  const res = await fetch(`${API_BASE}/hesoluong/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Cập nhật thất bại");
  }
  return res.json();
}

export async function deleteHeSoLuong(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/hesoluong/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Xóa thất bại");
  }
}
