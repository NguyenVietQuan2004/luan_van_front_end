"use client";

import { LuongCoSo } from "@/types/luongcoso";
import { fetchLuongCoSoById, createLuongCoSo, updateLuongCoSo } from "@/lib/luongcoso";
import LuongCoSoForm from "@/components/luongCoSoForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditLuongCoSoPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<LuongCoSo> | null>(null);

  useEffect(() => {
    if (!id || isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchLuongCoSoById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, isNew]);

  async function handleSubmit(data: Partial<LuongCoSo>) {
    if (isNew) {
      await createLuongCoSo(data);
    } else {
      await updateLuongCoSo(id, data);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <LuongCoSoForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm mức lương cơ sở mới" : "Cập nhật mức lương cơ sở"}
      />
    </div>
  );
}
