"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchStepById, createStep, updateStep, Step } from "@/lib/step";
import StepForm from "@/components/stepForm";

export default function EditStepPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [initialData, setInitialData] = useState<Partial<Step> | null>(null);

  useEffect(() => {
    if (isNew) return;

    const fetchData = async () => {
      try {
        const data = await fetchStepById(id);

        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, isNew]);
  async function handleSubmit(formData: FormData) {
    if (isNew) {
      await createStep(formData);
    } else {
      await updateStep(id, formData);
    }
    return { success: true };
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <StepForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isNew={isNew ? "Thêm bước mới" : "Cập nhật thông tin bước"}
      />
    </div>
  );
}
