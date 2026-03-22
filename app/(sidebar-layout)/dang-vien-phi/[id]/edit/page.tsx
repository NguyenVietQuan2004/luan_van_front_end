"use client";

import { DangVienPhi } from "@/types/dangvienphi";
import { fetchDangVienPhiById, createDangVienPhi, updateDangVienPhi } from "@/lib/dangvienphi";
import DangVienPhiForm from "@/components/dangVienPhiForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditDangVienPhiPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<DangVienPhi> | null>(null);

  useEffect(() => {
    if (!id || isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchDangVienPhiById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, isNew]);

  async function handleSubmit(data: Partial<DangVienPhi>) {
    if (isNew) {
      await createDangVienPhi(data);
    } else {
      await updateDangVienPhi(id, data);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <DangVienPhiForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm thông tin đảng viên phí mới" : "Cập nhật thông tin đảng viên phí"}
      />
    </div>
  );
}
