"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApplicantById, createApplicant, updateApplicant } from "@/lib/applicant";
import ApplicantForm from "@/components/ApplicantForm";
import { Applicant } from "@/lib/applicant";

export default function EditApplicantPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<Applicant> | null>(null);

  useEffect(() => {
    if (isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchApplicantById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, isNew]);

  async function handleSubmit(formData: FormData) {
    if (isNew) {
      await createApplicant(formData);
    } else {
      await updateApplicant(id, formData);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <ApplicantForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm hồ sơ cảm tình Đảng mới" : "Cập nhật thông tin hồ sơ"}
      />
    </div>
  );
}
