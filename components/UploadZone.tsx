"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { syllabusApi } from "@/lib/syll";

export default function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(docx|pdf|doc)$/i)) {
      alert("Chỉ hỗ trợ file .docx, .pdf, .doc");
      return;
    }

    setIsUploading(true);
    setStatus("Đang xử lý...");

    try {
      const aiResult = await syllabusApi.extractWithAI(file);
      const saved = await syllabusApi.createSyllabus(aiResult.sections || aiResult, file);

      alert("Upload & Extract thành công!");
      router.push(`/syllabus/${saved._id}/edit`);
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsUploading(false);
      setStatus("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <button
        // className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium disabled:opacity-50"
        className="bg-[#3872B2] text-white px-6 rounded py-2 text-[13px] font-medium hover:bg-[#2f5f9e]"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? status || "Đang xử lý..." : "+ Tải file Word/PDF mới"}
      </button>

      <input
        type="file"
        accept=".docx,.pdf,.doc"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
