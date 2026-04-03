"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApplicantById, updateApplicantStepWithFile } from "@/lib/applicant";
import { Applicant, ApplicantStep } from "@/lib/applicant";
import Link from "next/link";

export default function ApplicantStepsPage() {
  const params = useParams();
  const applicantId = params?.id as string;
  const router = useRouter();

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplicant = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApplicantById(applicantId);
      setApplicant(data);
    } catch (err: any) {
      setError(err.message || "Không tải được thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicantId) loadApplicant();
  }, [applicantId]);

  const handleUpdateStep = async (
    step: ApplicantStep,
    file?: File,
    completed?: boolean,
    newDetails?: Record<string, string>,
  ) => {
    try {
      const metadata = {
        completed: completed !== undefined ? completed : step.completed,
        details: newDetails || step.details,
      };

      await updateApplicantStepWithFile(applicantId, step.step_id._id, metadata, file);
      await loadApplicant();
      alert("Cập nhật bước thành công!");
    } catch (err: any) {
      alert("Cập nhật thất bại: " + err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!applicant) return <div className="p-6">Không tìm thấy hồ sơ</div>;

  return (
    <div className="container text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
      <div className="">
        <div>
          <div>
            <Link href={`/applicants/${applicantId}/edit`} className="text-[#3872b2] hover:underline">
              ← Quay lại hồ sơ
            </Link>
            <table className="w-100 mt-6 border-collapse border text-[13px]">
              <tbody>
                {/* Row 1: Họ và tên (có MSCB) */}
                <tr>
                  <td className="bg-gray-100 font-medium px-3 py-2 border w-1/3">Họ và tên</td>
                  <td className="border px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span>{applicant.dang_vien_id.ho_ten}</span>
                    </div>
                  </td>
                </tr>

                {/* Thêm các thông tin từ applicant nếu cần */}
                <tr>
                  <td className="bg-gray-100 font-medium px-3 py-2 border">Ngày sinh</td>
                  <td className="border px-3 py-2">
                    {applicant?.dang_vien_id.ngay_sinh
                      ? new Date(applicant.dang_vien_id.ngay_sinh).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                </tr>

                <tr>
                  <td className="bg-gray-100 font-medium px-3 py-2 border">Giới tính</td>
                  <td className="border px-3 py-2">{applicant?.dang_vien_id.gioi_tinh || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-bold text-xs my-2">
            Tiến độ: <span className="text-red-700">{applicant.steps.filter((s) => s.completed).length}</span>{" "}
            <span> / {applicant.steps.length}</span>
          </p>

          <div className="w-full mb-px bg-linear-to-b from-[#2f6fb3] to-[#2857a9] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
            QUẢN LÝ CÁC BƯỚC TRONG CẢM TÌNH ĐẢNG
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2 text-left">Thứ tự</th>
            <th className="border px-3 py-2 text-left">Tên bước</th>
            <th className="border px-3 py-2 text-center">Hoàn thành</th>
            <th className="border px-3 py-2 text-left">Ghi chú (Key → Date)</th>
            <th className="border px-3 py-2 text-left">File</th>
            <th className="border px-3 py-2 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {applicant.steps.map((step) => (
            <StepRow
              key={step.step_id._id}
              step={step}
              onUpdate={(file, completed, details) => handleUpdateStep(step, file, completed, details)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Component Row
function StepRow({
  step,
  onUpdate,
}: {
  step: ApplicantStep;
  onUpdate: (file?: File, completed?: boolean, details?: Record<string, string>) => void;
}) {
  const [localDetails, setLocalDetails] = useState<Record<string, string>>(step.details || {});
  const [newKey, setNewKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addKeyValue = () => {
    if (!newKey.trim()) return;
    setLocalDetails((prev) => ({ ...prev, [newKey.trim()]: "" }));
    setNewKey("");
  };

  const removeKey = (key: string) => {
    const { [key]: _, ...rest } = localDetails;
    setLocalDetails(rest);
  };

  const updateValue = (key: string, value: string) => {
    setLocalDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(file || undefined, undefined, localDetails);
      setFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async () => {
    await onUpdate(undefined, !step.completed);
  };

  const input = "w-full border px-2 py-1 text-[13px]";
  const button = "bg-[#3872B2] text-white px-3 py-1 rounded hover:opacity-90 text-xs disabled:opacity-50";

  return (
    <tr>
      <td className="border px-3 py-2 text-center">
        <Link href={`/steps/${step.step_id._id}/edit`} className="text-[#3872b2] underline">
          {step.step_id.step_order}
        </Link>
      </td>
      <td className="border px-3 py-2 font-medium">{step.step_id.name}</td>
      <td className="border px-3 py-2 text-center">
        <input type="checkbox" checked={step.completed} onChange={handleToggleComplete} disabled={isSubmitting} />
      </td>

      {/* Phần Ghi chú dạng key-value (value là date) */}
      <td className="border px-3 py-2">
        <div className="space-y-2">
          {Object.entries(localDetails).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <input type="text" value={key} readOnly className="w-full border px-2 py-1 bg-gray-100 text-[13px]" />
              <input
                type="date"
                value={value}
                onChange={(e) => updateValue(key, e.target.value)}
                className={input}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => removeKey(key)}
                className="text-red-600 hover:text-red-800 text-xs px-2"
                disabled={isSubmitting}
              >
                Xóa
              </button>
            </div>
          ))}

          {/* Thêm key mới */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Nhập tên trường mới (ví dụ: Ngày nộp)"
              className="flex-1 border px-2 py-1 text-[13px]"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={addKeyValue}
              className="bg-[#3872B2] text-white px-3 py-1 rounded text-xs"
              disabled={isSubmitting || !newKey.trim()}
            >
              + Thêm
            </button>
          </div>
        </div>
      </td>

      <td className="border px-3 py-2">
        {step.file_url ? (
          <div className="flex flex-col gap-1 text-xs">
            <a
              href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${step.file_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3872b2] hover:underline"
            >
              {step.file_name || "Xem file"}
            </a>
            {step.uploaded_at && (
              <span className="text-gray-500">{new Date(step.uploaded_at).toLocaleString("vi-VN")}</span>
            )}
          </div>
        ) : (
          "Chưa có file"
        )}
      </td>

      <td className="border px-3 py-2 text-center">
        <div className="flex flex-col gap-2 items-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-xs"
            // className="text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded  file:text-sm file:font-semibold file:bg-[#F7F7F7] file:text-[#515151] file:border file:border-[#243f50] hover:file:bg-[#e0e0e0]"
            disabled={isSubmitting}
          />
          <button onClick={handleSave} disabled={isSubmitting} className={button}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </td>
    </tr>
  );
}
