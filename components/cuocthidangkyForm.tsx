"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.split("T")[0];
}

type CuocthiDangKyFormValues = {
  contest_id: string;
  team_name?: string;
  members: { party_member_id: string; role: string }[];
  status: string;
  register_date?: string;
  result?: {
    title?: string;
    rank?: number;
    score?: number;
  };
  note?: string;
  created_by?: string;
};

type Props = {
  initialData?: any | null;
  onSubmit: (formData: FormData) => Promise<any>;
  isNew: string;
};

export default function CuocthidangkyForm({ initialData = {}, onSubmit, isNew }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [currentCertFile, setCurrentCertFile] = useState<string | null>(null);

  const [contests, setContests] = useState<any[]>([]);
  const [partyMembers, setPartyMembers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CuocthiDangKyFormValues>({
    defaultValues: {
      contest_id: "",
      team_name: "",
      members: [{ party_member_id: "", role: "member" }],
      status: "registered",
      register_date: "",
      result: { title: "", rank: undefined, score: undefined },
      note: "",
      created_by: "",
    },
  });

  const {
    fields: memberFields,
    append: addMember,
    remove: removeMember,
  } = useFieldArray({
    control,
    name: "members",
  });

  // fetch contests
  useEffect(() => {
    const fetchContests = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/contests`);
      const data = await res.json();
      setContests(data);
    };
    fetchContests();
  }, []);

  // fetch party members
  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/dang-vien`);
      const data = await res.json();
      setPartyMembers(data);
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!initialData) return;

    setCurrentCertFile(initialData.certificate_file || null);

    reset({
      contest_id: initialData.contest_id?._id || "",
      team_name: initialData.team_name || "",
      members: initialData.members?.map((m: any) => ({
        party_member_id: m.party_member_id?._id || "",
        role: m.role || "member",
      })) || [{ party_member_id: "", role: "member" }],
      status: initialData.status || "registered",
      register_date: toDateInput(initialData.register_date),
      result: {
        title: initialData.result?.title || "",
        rank: initialData.result?.rank,
        score: initialData.result?.score,
      },
      note: initialData.note || "",
      created_by: initialData.created_by?._id || "",
    });
  }, [initialData, reset]);

  const submitHandler = handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(values));

    if (file) formData.append("file", file);

    try {
      await onSubmit(formData);
      alert("Lưu thành công!");
      router.push("/cuocthi-dangky");
      router.refresh();
    } catch (err: any) {
      alert("Lưu thất bại: " + (err.message || "Lỗi không xác định"));
    }
  });
  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border";
  const td = "border px-2 bg-gray-100 py-2";
  if (contests.length === 0 || partyMembers.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container text-[13px] mx-auto p-4 bg-white  rounded">
      <form onSubmit={submitHandler} className="space-y-10 pb-12">
        <div className="w-full mb-px mt-4 text-sm bg-linear-to-b from-[#2f6fb3] to-[#0b3d91] text-white text-center font-semibold py-2 rounded-t-md border-b border-blue-900 shadow-sm">
          {isNew}
        </div>

        <table className="w-full border bg-gray-100">
          <tbody>
            <tr>
              <td colSpan={4} className="font-bold bg-[#EDF4F9] pl-2 py-1">
                Thông tin đăng ký cuộc thi
              </td>
            </tr>

            {/* ✅ contest select */}
            <tr>
              <td className={label}>Cuộc thi *</td>
              <td className={td} colSpan={3}>
                <select {...register("contest_id")} className={input} required>
                  <option value="">-- Chọn cuộc thi --</option>
                  {contests.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            <tr>
              <td className={label}>Ngày đăng ký</td>
              <td className={td}>
                <input type="date" {...register("register_date")} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Tên đội</td>
              <td className={td} colSpan={3}>
                <input {...register("team_name")} className={input} />
              </td>
            </tr>

            {/* MEMBERS */}
            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 font-semibold">
                Danh sách thành viên
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <button
                  type="button"
                  className="text-[#515151] my-2 ml-2 hover:bg-white/10 bg-[#F7F7F7] border-[#6088a0] border hover:opacity-75 cursor-pointer px-3 py-0.5 text-xs rounded"
                  onClick={() => addMember({ party_member_id: "", role: "member" })}
                >
                  + Thêm thành viên
                </button>
              </td>
            </tr>
            {memberFields.map((field, idx) => (
              <tr key={field.id}>
                <td className={td}>
                  {/* ✅ member select */}
                  <select {...register(`members.${idx}.party_member_id`)} className={input} required>
                    <option value="">-- Chọn đảng viên --</option>
                    {partyMembers.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.ho_ten}
                      </option>
                    ))}
                  </select>
                </td>

                <td className={td}>
                  <select {...register(`members.${idx}.role`)} className={input}>
                    <option value="member">Thành viên</option>
                    <option value="leader">Trưởng nhóm</option>
                    <option value="vice_leader">Phó nhóm</option>
                  </select>
                </td>

                <td className="text-center border">
                  <button type="button" onClick={() => removeMember(idx)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            <tr>
              <td className={label}>Trạng thái</td>
              <td className={td}>
                <select {...register("status")} className={input}>
                  <option value="registered">Đã đăng ký</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className={label}>Danh hiệu</td>
              <td className={td}>
                <input {...register("result.title")} className={input} placeholder="Giải nhất..." />
              </td>

              <td className={label}>Thứ hạng</td>
              <td className={td}>
                <input type="number" {...register("result.rank", { valueAsNumber: true })} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Điểm</td>
              <td className={td}>
                <input type="number" {...register("result.score", { valueAsNumber: true })} className={input} />
              </td>
            </tr>

            <tr>
              <td className={label}>Chứng nhận (file)</td>
              <td className={td} colSpan={3}>
                <input
                  type="file"
                  accept=".pdf,.docx,.jpg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded  file:text-sm file:font-semibold file:bg-[#F7F7F7] file:text-[#515151] file:border file:border-[#243f50] hover:file:bg-[#e0e0e0]"
                />

                {/* file hiện tại */}
                {currentCertFile && !file && (
                  <div className="mt-2 text-sm text-[#3872b2]">
                    File hiện tại:{" "}
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${currentCertFile}`}
                      target="_blank"
                      className="underline hover:text-[#3872b2]"
                    >
                      {currentCertFile.split("/").pop()}
                    </a>
                  </div>
                )}

                {/* file mới */}
                {file && (
                  <p className="mt-2 text-sm text-green-600">
                    Đã chọn: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </td>
            </tr>
            {/* <tr>

              <td colSpan={4}>
                <textarea {...register("note")} className="w-full border" />
              </td>
            </tr> */}

            <tr>
              <td colSpan={4} className="bg-[#e6edf5] px-2 py-1 border font-semibold">
                Ghi chú
              </td>
            </tr>

            <tr>
              <td colSpan={4} className="border px-2 py-2">
                <textarea
                  {...register("note")}
                  rows={4}
                  className="w-full border bg-white px-2 py-1 text-[13px]"
                  placeholder="Ghi chú..."
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end gap-4 pt-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 cursor-pointer hover:opacity-75 rounded-lg  underline border-[#80B5D7] text-[14px]"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#3872B2] border cursor-pointer hover:opacity-75 border-[#80B5D7] text-[14px] font-bold px-10 py-3 text-white rounded-lg disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
