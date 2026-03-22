"use client";

import { DangPhi } from "@/types/dangphi";
import { fetchDangPhiById, createDangPhi, updateDangPhi } from "@/lib/dangphi";
import DangPhiForm from "@/components/dangPhiForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditDangPhiPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<DangPhi> | null>(null);

  useEffect(() => {
    if (!id || isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchDangPhiById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, isNew]);

  async function handleSubmit(data: Partial<DangPhi>) {
    if (isNew) {
      await createDangPhi(data);
    } else {
      await updateDangPhi(id, data);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <DangPhiForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm bản ghi đảng phí mới" : "Cập nhật bản ghi đảng phí"}
      />
    </div>
  );
}
