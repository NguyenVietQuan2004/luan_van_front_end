// types/applicant.ts
import { z } from "zod";

export const applicantSchema = z.object({
  // name: z.string().min(1, "Họ tên là bắt buộc"),
  // dob: z.string().optional(), // hoặc z.date() nếu bạn muốn xử lý Date
  // gender: z.enum(["Nam", "Nữ", "Khác"]).optional(),

  dang_vien_id: z.string(),
});

export type ApplicantFormData = z.infer<typeof applicantSchema>;
