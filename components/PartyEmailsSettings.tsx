"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PartyEmailsSettings() {
  const [emailsStr, setEmailsStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEmails();
  }, []);
  console.log(process.env.NEXT_PUBLIC_API_ENDPOINT);
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/party-emails`);
      const data = await res.json();
      setEmailsStr(data.emails || "");
    } catch {
      setMessage("Không tải được danh sách");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/party-emails`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emailsStr }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage("Đã lưu thành công!");
    } catch (err: any) {
      setMessage("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl ml-4">
      {/* <h2 className="text-lg font-semibold my-4">Email nhận thông báo tài liệu</h2> */}
      <p className="text-sm text-slate-500 mt-4">
        Nhập các email cách nhau bằng dấu phẩy (ví dụ: a@gmail.com, b@gmail.com)
      </p>

      <Textarea
        value={emailsStr}
        onChange={(e) => setEmailsStr(e.target.value)}
        placeholder="mail1@gmail.com, mail2@gmail.com, ..."
        rows={4}
        disabled={loading || saving}
        className=" ring-0! focus:border! focus:border-black!"
      />

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving || loading} className="rounded bg-[#232934]">
          {saving ? (
            <>
              <Loader2 className="mr-2  h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu danh sách"
          )}
        </Button>

        {message && <p className={message.includes("Lỗi") ? "text-red-600" : "text-green-600"}>{message}</p>}
      </div>
    </div>
  );
}
