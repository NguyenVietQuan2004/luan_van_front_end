import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DangVien } from "@/types/dangvien";

export const ExportDangVienExcel = (data: DangVien[]) => {
  const formatDate = (dateString?: string | null | Date): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const excelRows: any[] = [];

  const sortedData = [...data].sort((a, b) => (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi"));

  sortedData.forEach((dv, idx) => {
    // ================== CỘT 6: Nghề nghiệp trước & hiện nay ==================
    const ngheNghiepText = (dv.nghe_nghiep || [])
      .map((n) => `${n.ten_nghe || ""} (${formatDate(n.tu_ngay)} - ${formatDate(n.den_ngay)})`)
      .join("\n");

    // ================== CỘT 8: Số huy hiệu Đảng ==================
    const huyHieuText = (dv.huy_hieu || []).map((h) => h.loai || "").join(", ");

    // ================== CỘT 10-11: Ngày chuyển đảng ==================
    const chuyenDangDi = (dv.lich_su_chuyen_dang || []).map((l) => formatDate(l.ngay_chuyen_di)).join("\n");

    const chuyenDangDen = (dv.lich_su_chuyen_dang || [])
      .map((l) => `${l.noi_den || ""} (${formatDate(l.ngay_chuyen_den)})`)
      .join("\n");

    // ================== CỘT 12-13: Ra đảng / Mất ==================
    const raDangText = dv.thong_tin_khac?.hinh_thuc_ra_dang
      ? `${formatDate(dv.thong_tin_khac.ngay_ra_dang)} - ${dv.thong_tin_khac.hinh_thuc_ra_dang}`
      : "";

    const matText = dv.thong_tin_khac?.ngay_mat
      ? `${formatDate(dv.thong_tin_khac.ngay_mat)} - ${dv.thong_tin_khac.ly_do_mat || ""}`
      : "";

    excelRows.push({
      STT: idx + 1,

      // Cột 2
      "Họ và tên\nx Họ và tên khai sinh, ngày sinh": `${dv.ho_ten || ""}\n${dv.ho_ten_khai_sinh || ""}, ${formatDate(dv.ngay_sinh)}`,

      // Cột 3
      "Nam, nữ, dân tộc, tôn giáo": `${dv.gioi_tinh || ""}, ${dv.dan_toc || ""}, ${dv.ton_giao || ""}`,

      // Cột 4
      "Quê quán": dv.que_quan || "",

      // Cột 5
      "Văn hóa, lý luận, ngoại ngữ, CMNV": `${dv.trinh_do?.van_hoa || ""}\n${dv.trinh_do?.ly_luan || ""}\n${dv.trinh_do?.ngoai_ngu || ""}\n${dv.trinh_do?.chuyen_mon || ""}`,

      // Cột 6
      "Nghề nghiệp trước khi vào Đảng\nNghề nghiệp hiện nay": ngheNghiepText || "",

      // Cột 7
      "Ngày vào Đảng, ngày chính thức": `${formatDate(dv.ngay_vao_dang)}\n${formatDate(dv.ngay_vao_dang_chinh_thuc)}`,

      // Cột 8
      "Số thẻ đảng viên\nSố huy hiệu Đảng (40, 50, 60, 70 năm)": `${dv.so_the_dang_vien || ""}\n${huyHieuText}`,

      // Cột 9
      "Đội bộ Công an, Quân đội": dv.trang_thai_quan_doi || "",

      // Cột 10
      "Ngày chuyển đi Đảng bộ cũ": chuyenDangDi,

      // Cột 11
      "Ngày chuyển đến Đảng bộ mới\nNơi đến": chuyenDangDen,

      // Cột 12
      "Ngày bị chết\nLý do": matText,

      // Cột 13
      "Ngày ra khỏi Đảng\nHình thức ra Đảng": raDangText,

      // Cột 14
      "Ghi chú": dv.ghi_chu || "",
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(excelRows);

  // Điều chỉnh độ rộng cột (rất quan trọng)
  worksheet["!cols"] = [
    { wch: 6 }, // STT
    { wch: 35 }, // Họ và tên + khai sinh + ngày sinh
    { wch: 22 }, // Nam nữ dân tộc tôn giáo
    { wch: 28 }, // Quê quán
    { wch: 32 }, // Văn hóa, lý luận...
    { wch: 40 }, // Nghề nghiệp (rộng vì nhiều dòng)
    { wch: 22 }, // Ngày vào Đảng
    { wch: 28 }, // Số thẻ + huy hiệu
    { wch: 20 }, // Đội bộ
    { wch: 22 }, // Chuyển đi
    { wch: 32 }, // Chuyển đến
    { wch: 25 }, // Chết
    { wch: 25 }, // Ra Đảng
    { wch: 35 }, // Ghi chú
  ];

  // Wrap text để xuống dòng đẹp
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = {
        alignment: { wrapText: true, vertical: "top" },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDangVien");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "So_Danh_Sach_Dang_Vien.xlsx");
};
