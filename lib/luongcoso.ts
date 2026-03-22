// lib/api.ts

import { LuongCoSo } from "@/types/luongcoso";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchLuongCoSoList(): Promise<LuongCoSo[]> {
  const res = await fetch(`${API_BASE}/luongcoso`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được danh sách lương cơ sở");
  return res.json();
}

export async function fetchLuongCoSoById(id: string): Promise<LuongCoSo> {
  const res = await fetch(`${API_BASE}/luongcoso/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy mức lương cơ sở");
  return res.json();
}

export async function createLuongCoSo(data: Partial<LuongCoSo>): Promise<LuongCoSo> {
  const res = await fetch(`${API_BASE}/luongcoso`, {
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

export async function updateLuongCoSo(id: string, data: Partial<LuongCoSo>): Promise<LuongCoSo> {
  const res = await fetch(`${API_BASE}/luongcoso/${id}`, {
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

export async function deleteLuongCoSo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/luongcoso/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Xóa thất bại");
  }
}
