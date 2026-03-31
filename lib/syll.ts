// lib/api.ts
// ====================== CẤU HÌNH API ======================
const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT + "/api/syll";
// ========================================================

export const syllabusApi = {
  // ==================== GỌI AI EXTRACT (Port 8000) ====================
  extractWithAI: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_AI}/syll`, {
      // ← Gọi thẳng port 8000
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "AI Extract thất bại");
    }

    const result = await res.json();
    return result; // Giả sử trả về { sections: { ... } }
  },

  // ==================== GỌI BACKEND (Port 5000) ====================
  createSyllabus: async (sections: any, originalFile?: File) => {
    const formData = new FormData();

    // Gửi sections dưới dạng JSON string (theo controller của bạn)
    formData.append("data", JSON.stringify({ sections }));

    if (originalFile) {
      formData.append("file", originalFile);
    }

    const res = await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Lưu syllabus thất bại");
    }

    const result = await res.json();
    return result.data || result;
  },

  // Các hàm khác giữ nguyên (getAll, getById, update, delete)
  getAll: async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Lấy danh sách thất bại");
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy syllabus");
    return await res.json();
  },

  update: async (id: string, sections: any, newFile?: File) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ sections }));

    if (newFile) formData.append("file", newFile);

    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) throw new Error("Cập nhật thất bại");
    return await res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xóa thất bại");
  },
};
