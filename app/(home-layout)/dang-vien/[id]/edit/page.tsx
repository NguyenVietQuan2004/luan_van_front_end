"use client";

import { DangVien } from "@/types/dangvien";
import { fetchDangVienById, createDangVien, updateDangVien } from "@/lib/api";
import DangVienForm from "@/components/dangVienForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditDangVienPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<DangVien> | null>(null);

  useEffect(() => {
    if (!id || isNew) return;

    const fetchApi = async () => {
      const data = await fetchDangVienById(id);
      setInitialData(data);
    };

    fetchApi();
  }, [id, isNew]);

  async function handleSubmit(data: Partial<DangVien>) {
    if (isNew) {
      await createDangVien(data);
    } else {
      await updateDangVien(id, data);
    }

    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <DangVienForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm đảng viên mới" : "Cập nhật thông tin Đảng viên"}
      />
    </div>
  );
}
