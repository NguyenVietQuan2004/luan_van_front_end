"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCuocthiById, createCuocthi, updateCuocthi } from "@/lib/contest";
import CuocthiForm from "@/components/cuocthiForm";

export default function EditCuocthiPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<any | null>(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchCuocthiById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew]);

  const handleSubmit = async (data: FormData) => {
    if (isNew) {
      await createCuocthi(data);
    } else {
      await updateCuocthi(id, data);
    }
    return { success: true };
  };

  if (loading) {
    return <div className="container p-6">Đang tải thông tin cuộc thi...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <CuocthiForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm cuộc thi mới" : "Cập nhật cuộc thi"}
      />
    </div>
  );
}
