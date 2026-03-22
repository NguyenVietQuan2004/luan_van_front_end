"use client";

import { HeSoLuong } from "@/types/hesoluong";
import { fetchHeSoLuongById, createHeSoLuong, updateHeSoLuong } from "@/lib/hesoluong";
import HeSoLuongForm from "@/components/heSoLuongForm"; // bạn cần tạo component này
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditHeSoLuongPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<HeSoLuong> | null>(null);

  useEffect(() => {
    if (!id || isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchHeSoLuongById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, isNew]);

  async function handleSubmit(data: Partial<HeSoLuong>) {
    if (isNew) {
      await createHeSoLuong(data);
    } else {
      await updateHeSoLuong(id, data);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <HeSoLuongForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm hệ số lương mới" : "Cập nhật hệ số lương"}
      />
    </div>
  );
}
