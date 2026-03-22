"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCuocthidangkyById, createCuocthidangky, updateCuocthidangky } from "@/lib/dang-ky";
import CuocthidangkyForm from "@/components/cuocthidangkyForm";

export default function EditCuocthidangkyPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<any | null>(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchCuocthidangkyById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew]);

  const handleSubmit = async (formData: any) => {
    if (isNew) {
      await createCuocthidangky(formData);
    } else {
      await updateCuocthidangky(id, formData);
    }
    return { success: true };
  };

  if (loading) {
    return <div className="container p-6">Đang tải thông tin đăng ký...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <CuocthidangkyForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Đăng ký mới cuộc thi" : "Cập nhật đăng ký cuộc thi"}
      />
    </div>
  );
}
