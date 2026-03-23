// lib/api/applicant.ts
const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api";

export interface ApplicantStep {
  step_id: {
    _id: string;
    name: string;
    step_order: number;
    template_file?: string | null;
  };
  completed: boolean;
  details: Record<string, any>;
  file_url?: string;
  file_name?: string;
  uploaded_at?: string;
}

export interface Applicant {
  _id: string;
  name: string;
  dob?: string; // ISO string
  gender?: string;
  steps: ApplicantStep[];
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchApplicants(): Promise<Applicant[]> {
  const res = await fetch(`${API_BASE}/applicants`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được danh sách");
  return res.json();
}

export async function fetchApplicantById(id: string): Promise<Applicant> {
  const res = await fetch(`${API_BASE}/applicants/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy hồ sơ");
  return res.json();
}

export async function createApplicant(data: FormData): Promise<Applicant> {
  const res = await fetch(`${API_BASE}/applicants`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Tạo thất bại");
  }
  return res.json();
}

export async function updateApplicant(id: string, data: FormData): Promise<Applicant> {
  const res = await fetch(`${API_BASE}/applicants/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Cập nhật thất bại");
  }
  return res.json();
}

export async function deleteApplicant(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/applicants/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa thất bại");
}

// Cập nhật step + upload file (dùng endpoint merge tiện nhất)
export async function updateApplicantStepWithFile(
  applicantId: string,
  stepId: string,
  metadata: any,
  file?: File,
): Promise<Applicant> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(metadata));

  if (file) {
    formData.append("file", file);
  }

  const res = await fetch(`${API_BASE}/applicants/${applicantId}/step/${stepId}/upload-merge`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Cập nhật bước thất bại");
  }
  return res.json();
}
