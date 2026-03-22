// lib/api/step.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Step {
  _id: string;
  name: string;
  step_order: number;
  template_file?: string | null;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchSteps(): Promise<Step[]> {
  const res = await fetch(`${API_BASE}/steps`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được danh sách bước");
  return res.json();
}

export async function fetchStepById(id: string): Promise<Step> {
  const res = await fetch(`${API_BASE}/steps/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy bước");
  return res.json();
}

export async function createStep(data: FormData): Promise<Step> {
  const res = await fetch(`${API_BASE}/steps`, {
    method: "POST",
    body: data, // FormData chứa cả fields + file
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Tạo bước thất bại");
  }
  return res.json();
}

export async function updateStep(id: string, data: FormData): Promise<Step> {
  const res = await fetch(`${API_BASE}/steps/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Cập nhật thất bại");
  }
  return res.json();
}

export async function deleteStep(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/steps/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa thất bại");
}
