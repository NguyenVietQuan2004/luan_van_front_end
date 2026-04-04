// // types/syllabus.ts
export interface Section {
  heading: string;
  content: string;
  is_empty: boolean;
  sub_fields?: Record<string, any>;
  rows?: Record<string, any>[];
  table_headers?: string[];
}

// export interface Syllabus {
//   _id: string;
//   filename: string;
//   originalName: string;
//   extractedAt: string;
//   sections: Record<string, Section>; // Map: section_1, section_2...
//   status: "success" | "failed";
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface Syllabus {
  _id: string;
  filename: string;
  originalName: string;
  file_path?: string; // ← THÊM DÒNG NÀY
  extractedAt: string;
  sections: Record<string, Section>;
  status: "success" | "failed";
  createdAt?: string;
  updatedAt?: string;
}
