const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000/api";

// ===================== REPORT =====================
export const fetchReports = async (): Promise<any[]> => {
  const res = await fetch(`${API_URL}/api/reports`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Không thể tải danh sách báo cáo");
  return res.json();
};

export const fetchReportById = async (id: string): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Không tìm thấy báo cáo");
  return res.json();
};

export const createReport = async (formData: FormData): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Lỗi tạo báo cáo");
  }

  return res.json();
};

export const updateReport = async (id: string, formData: FormData): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Lỗi cập nhật báo cáo");
  }

  return res.json();
};

export const deleteReport = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/reports/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Lỗi xóa báo cáo");
  }
};

// ===================== REPORT CODE =====================
export const fetchReportCodes = async (): Promise<any[]> => {
  const res = await fetch(`${API_URL}/api/reports/codes`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Không thể tải danh sách mã báo cáo");
  return res.json();
};

// ===================== REPORT TYPE (nếu sau này cần) =====================
export const fetchReportTypes = async (): Promise<any[]> => {
  const res = await fetch(`${API_URL}/api/reports/types`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Không thể tải danh sách loại báo cáo");
  return res.json();
};

// ===================== REPORT TYPE =====================
export const createReportType = async (data: { name: string }): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Lỗi tạo loại báo cáo");
  }
  return res.json();
};

export const updateReportType = async (id: string, data: { name: string }): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Lỗi cập nhật loại báo cáo");
  }
  return res.json();
};

export const deleteReportType = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/reports/types/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa loại báo cáo thất bại");
};

// ===================== REPORT CODE =====================
export const createReportCode = async (formData: FormData): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/codes`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Lỗi tạo mã báo cáo");
  }
  return res.json();
};

export const updateReportCode = async (id: string, formData: FormData): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/codes/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Lỗi cập nhật mã báo cáo");
  }
  return res.json();
};

export const deleteReportCode = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/reports/codes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa mã báo cáo thất bại");
};

export const fetchReportTypeById = async (id: string): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/types/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy loại báo cáo");
  return res.json();
};

// ===================== REPORT CODE =====================

export const fetchReportCodeById = async (id: string): Promise<any> => {
  const res = await fetch(`${API_URL}/api/reports/codes/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không tìm thấy mã báo cáo");
  return res.json();
};

export const fetchNextSo = async (codeId: string): Promise<{ nextSo: number }> => {
  const res = await fetch(`${API_URL}/api/reports/next-so?code_id=${codeId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Không thể lấy số tiếp theo");
  return res.json();
};
