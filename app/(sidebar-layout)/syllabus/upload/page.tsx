// app/syllabus/upload/page.tsx
import UploadZone from "@/components/UploadZone";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white">Tải lên Syllabus</h1>
        <p className="text-gray-400 mt-3">Upload file → AI Extract → Lưu Backend</p>
      </div>

      <UploadZone />
    </div>
  );
}
