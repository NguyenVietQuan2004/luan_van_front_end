"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { DocumentColumns } from "./table/document-columns";
import PartyEmailsSettings from "@/components/PartyEmailsSettings";

interface ExtractionResult {
  markdown: string | null;
  deadline: string;
  summary: string;
  status: string;
  pages_processed: number | null;
  tables_found: number | null;
  figures_found: number | null;
  error?: string;
}

interface Document {
  _id: string;
  file_name: string;
  file_path: string;
  markdown: string | null;
  deadline: string | null;
  summary: string;
  uploaded_at: string;
}

const normalizeToISO = (str: string | null): string | null => {
  if (!str || str.toLowerCase() === "null") return null;
  const match = str.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const date = new Date(str);
  return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : null;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  useEffect(() => {
    fetchDocuments();
  }, []);
  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/documents`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      setError("Không tải được lịch sử");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSelectedDoc(null);
    }
  };

  const handleProcessAndSave = async () => {
    if (!file) return setError("Chọn file trước!");
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const extractRes = await fetch(`${process.env.NEXT_PUBLIC_API_AI}/extract`, {
        method: "POST",
        body: formData,
      });
      if (!extractRes.ok) throw new Error((await extractRes.json()).detail || "Lỗi trích xuất");
      const aiData: ExtractionResult = await extractRes.json();

      if (aiData.status !== "success") throw new Error(aiData.error || "Thất bại");

      const saveFormData = new FormData();
      saveFormData.append("file", file);
      saveFormData.append(
        "data",
        JSON.stringify({
          markdown: aiData.markdown,
          deadline: normalizeToISO(aiData.deadline),
          summary: aiData.summary,
        }),
      );

      const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/documents`, {
        method: "POST",
        body: saveFormData,
      });
      if (!saveRes.ok) throw new Error("Lưu thất bại");

      await fetchDocuments();
      setFile(null);
      alert("Xử lý & lưu thành công!");
    } catch (err: any) {
      setError(err.message || "Lỗi xảy ra");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("vi-VN", { dateStyle: "medium" }) : "—";

  const formatDeadline = (dl: string | null) => (!dl || dl.toLowerCase() === "null" ? "Không có" : formatDate(dl));

  return (
    <div className="min-h-screen bg-white rounded-lg">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Toàn bộ nội dung merge thành 1 khối chính */}
        <div className="bg-white rounded-xl  border-slate-200 overflow-hidden">
          {/* Header + Upload ở trên cùng */}
          <div className="p-5 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold  text-[#232934]">Trích xuất Tài liệu</h1>
                <p className="text-sm text-slate-600 mt-1">Upload → lấy deadline, tóm tắt, markdown tự động</p>
              </div>
            </div>

            {/* Upload siêu gọn */}
            <label
              htmlFor="file-upload"
              className="group flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-md hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors cursor-pointer mb-3"
            >
              <p className="text-sm font-medium text-slate-600 group-hover:text-indigo-600">Chọn hoặc kéo file</p>
              <p className="text-xs text-slate-500">PDF • DOCX • TXT • MD</p>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded text-xs mb-3">
                <span className="font-medium truncate max-w-[65%]">{file.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                  <button onClick={() => setFile(null)} className="text-red-600 hover:text-red-800 font-medium">
                    Xóa
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleProcessAndSave}
              disabled={loading || !file}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors ${
                loading || !file ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Trích xuất & Lưu"
              )}
            </button>

            {error && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs text-center">
                {error}
              </div>
            )}
          </div>

          <PartyEmailsSettings />
          {/* Lịch sử DataTable ngay bên dưới, không có khoảng trống thừa */}
          <div className="p-4">
            {documents.length === 0 ? (
              <div className="py-10 text-center text-slate-500">Chưa có tài liệu nào</div>
            ) : (
              <DataTable
                columns={DocumentColumns}
                data={documents}
                filterField="file_name"
                tableName="Danh sách tài liệu đã lưu"
                meta={{
                  onViewDetail: (doc: Document) => setSelectedDoc(doc),
                }}
              />
            )}

            {/* Stats nhỏ gọn ở chân bảng */}
            {documents.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-700 flex justify-between items-center">
                <div>
                  Tổng: <span className="font-medium">{documents.length}</span>
                </div>
                <div>
                  Có deadline:{" "}
                  <span className="font-medium">
                    {documents.filter((d) => d.deadline && d.deadline.toLowerCase() !== "null").length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal chi tiết */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-slate-900 truncate pr-10">{selectedDoc.file_name}</h2>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-500 hover:text-slate-900 text-2xl">
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100">
                    <div className="text-sm font-medium text-emerald-700 mb-1">Deadline</div>
                    <p className="text-xl font-bold text-emerald-800">{formatDeadline(selectedDoc.deadline)}</p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                    <div className="text-sm font-medium text-[#3872b2] mb-1">Upload</div>
                    <p className="text-xl font-bold text-[#3872b2] ">{formatDate(selectedDoc.uploaded_at)}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Tóm tắt</h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap text-slate-800 leading-relaxed text-sm">
                      {selectedDoc.summary || "Không có tóm tắt"}
                    </div>
                  </div>

                  {selectedDoc.markdown && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Markdown</h3>
                      <div className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-80 font-mono text-sm leading-6 whitespace-pre-wrap border border-slate-700">
                        {selectedDoc.markdown}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
