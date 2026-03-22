import { z } from "zod";

export const stepSchema = z.object({
  name: z.string().min(1, "Tên bước là bắt buộc"),
  step_order: z.number().int().min(1, "Thứ tự phải là số nguyên dương ≥ 1"),
  note: z.string().optional(),
});

export type StepFormData = z.infer<typeof stepSchema>;
