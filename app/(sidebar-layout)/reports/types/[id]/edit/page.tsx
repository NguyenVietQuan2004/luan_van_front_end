"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchReportTypeById, createReportType, updateReportType } from "@/lib/report";
import ReportTypeForm from "@/components/ReportTypeForm";

export default function EditReportTypePage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchReportTypeById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, isNew]);

  async function handleSubmit(data: any) {
    if (isNew) {
      await createReportType(data);
    } else {
      await updateReportType(id, data);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <ReportTypeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm loại báo cáo mới" : "Cập nhật loại báo cáo"}
      />
    </div>
  );
}
