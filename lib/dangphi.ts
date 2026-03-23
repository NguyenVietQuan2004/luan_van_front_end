import { DangPhi } from "@/types/dangphi";

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api";

export async function fetchDangPhiList(): Promise<DangPhi[]> {
  const res = await fetch(`${API_BASE}/dangphi`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được danh sách đảng phí");
  return res.json();
}

export async function fetchDangPhiById(id: string): Promise<DangPhi> {
  const res = await fetch(`${API_BASE}/dangphi/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy bản ghi đảng phí");
  return res.json();
}

export async function createDangPhi(data: Partial<DangPhi>): Promise<DangPhi> {
  const res = await fetch(`${API_BASE}/dangphi`, {
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

export async function updateDangPhi(id: string, data: Partial<DangPhi>): Promise<DangPhi> {
  const res = await fetch(`${API_BASE}/dangphi/${id}`, {
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

export async function deleteDangPhi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/dangphi/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Xóa thất bại");
  }
}
