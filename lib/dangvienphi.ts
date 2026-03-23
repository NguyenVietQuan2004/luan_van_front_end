import { DangVienPhi } from "@/types/dangvienphi";

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api";

export async function fetchDangVienPhiList(): Promise<DangVienPhi[]> {
  const res = await fetch(`${API_BASE}/dangvienphi`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được danh sách đảng viên phí");
  return res.json();
}

export async function fetchDangVienPhiById(id: string): Promise<DangVienPhi> {
  const res = await fetch(`${API_BASE}/dangvienphi/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy thông tin đảng viên phí");
  return res.json();
}

export async function createDangVienPhi(data: Partial<DangVienPhi>): Promise<DangVienPhi> {
  const res = await fetch(`${API_BASE}/dangvienphi`, {
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

export async function updateDangVienPhi(id: string, data: Partial<DangVienPhi>): Promise<DangVienPhi> {
  const res = await fetch(`${API_BASE}/dangvienphi/${id}`, {
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

export async function deleteDangVienPhi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/dangvienphi/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Xóa thất bại");
  }
}
