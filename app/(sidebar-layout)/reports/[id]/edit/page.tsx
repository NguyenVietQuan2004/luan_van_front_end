"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchReportById, createReport, updateReport } from "@/lib/report";
import ReportForm from "@/components/ReportForm";
import { Report } from "@/types/report";

export default function EditReportPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<Report> | null>(null);

  useEffect(() => {
    if (isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchReportById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, isNew]);

  async function handleSubmit(formData: FormData) {
    if (isNew) {
      await createReport(formData);
    } else {
      await updateReport(id, formData);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <ReportForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm báo cáo mới" : "Cập nhật báo cáo"}
      />
    </div>
  );
}
