"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchReportCodeById, createReportCode, updateReportCode } from "@/lib/report";
import ReportCodeForm from "@/components/ReportCodeForm";

export default function EditReportCodePage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchReportCodeById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, isNew]);

  async function handleSubmit(formData: FormData) {
    if (isNew) {
      await createReportCode(formData);
    } else {
      await updateReportCode(id, formData);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <ReportCodeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm mã danh mục mới" : "Cập nhật mã danh mục"}
      />
    </div>
  );
}
