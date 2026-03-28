import { z } from "zod";

export const reportSchema = z.object({
  code_id: z.string().min(1, "Vui lòng chọn mã báo cáo"),
  title: z.string().min(1, "Tiêu đề không được để trống"),
  ngay_ban_hanh: z.string().optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;

export interface ReportCode {
  _id: string;
  code: string;
  name: string;
  type_id?: {
    _id: string;
    name: string;
  };
}

export interface Report {
  _id: string;
  so: number;
  code_id: ReportCode;
  title?: string;
  ngay_ban_hanh?: string;
  file_url?: string;
  file_name?: string;
  createdAt?: string;
  updatedAt?: string;
}
