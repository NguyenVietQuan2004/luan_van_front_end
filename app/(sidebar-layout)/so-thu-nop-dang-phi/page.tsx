"use client";
import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import { DangPhi } from "@/types/dangphi";

export default function SoThuNopDangPhiPage() {
  const [dangPhiList, setDangPhiList] = useState<DangPhi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bộ lọc
  const [selectedThang, setSelectedThang] = useState<number>(new Date().getMonth() + 1);
  const [selectedNam, setSelectedNam] = useState<number>(new Date().getFullYear());

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/dangphi?nam=${selectedNam}${selectedThang ? `&thang=${selectedThang}` : ""}`,
        {
          cache: "no-store",
        },
      );
      if (!res.ok) throw new Error("Không tải được dữ liệu đảng phí");
      const data = await res.json();
      setDangPhiList(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedThang, selectedNam]);

  // Tính toán tổng hợp cho Phần II
  const tongHopTheoThang = Array(12)
    .fill(null)
    .map((_, i) => {
      const thang = i + 1;
      const records = dangPhiList.filter((dp) => dp.thang === thang && dp.nam === selectedNam);
      const tongDaThu = records.reduce((sum, r) => sum + r.da_thu, 0);
      const soDangVien = records.length;
      const soMien = 0; // cần logic xác định miễn (từ mien_dang_phi của dangvien_phi_id)
      const chuaDong = 0; // cần tính thêm nếu có logic nợ

      return {
        thang,
        soDangVien,
        soMien,
        chuaDong,
        daThu: tongDaThu,
        trichGiu: Math.round(tongDaThu * 0.4), // giả sử trích giữ 40% (bạn chỉnh lại tỷ lệ)
        phaiNop: Math.round(tongDaThu * 0.6),
        daNop: 0, // cần thêm trường theo dõi nộp cấp trên
        chuaNop: Math.round(tongDaThu * 0.6),
      };
    });

  const tongQuy = (start: number, end: number) =>
    tongHopTheoThang.slice(start - 1, end).reduce(
      (acc, m) => ({
        soDangVien: acc.soDangVien + m.soDangVien,
        soMien: acc.soMien + m.soMien,
        chuaDong: acc.chuaDong + m.chuaDong,
        daThu: acc.daThu + m.daThu,
        trichGiu: acc.trichGiu + m.trichGiu,
        phaiNop: acc.phaiNop + m.phaiNop,
        daNop: acc.daNop + m.daNop,
        chuaNop: acc.chuaNop + m.chuaNop,
      }),
      { soDangVien: 0, soMien: 0, chuaDong: 0, daThu: 0, trichGiu: 0, phaiNop: 0, daNop: 0, chuaNop: 0 },
    );

  const quy1 = tongQuy(1, 3);
  const quy2 = tongQuy(4, 6);
  const quy3 = tongQuy(7, 9);
  const quy4 = tongQuy(10, 12);
  const tongNam = tongQuy(1, 12);

  const input = "bg-white w-full h-[28px] px-2 border border-gray-400 text-[13px]";
  const label = "bg-gray-100 font-medium px-2 py-1 border text-[13px] text-center";
  const td = "border px-2 py-1 text-[13px] text-center";
  const th = "bg-[#EDF4F9] font-semibold border px-2 py-1 text-[13px]";

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    // --- PHẦN I ---
    const phanI = dangPhiList.map((dp: any, index) => ({
      STT: index + 1,
      "Họ và tên đảng viên": dp.dangvien_phi_id?.dang_vien_id?.ho_ten || "N/A",
      "Được miễn": dp.dangvien_phi_id?.mien_dang_phi?.length ? "X" : "-",
      "Tháng/Năm": `${dp.thang}/${dp.nam}`,
      "Thu nhập tính đóng đảng phí": dp.thu_nhap || 0,
      "Đảng phí tháng này": dp.dang_phi || 0,
      "Truy thu các tháng trước": dp.truy_thu || 0,
      "Cộng đảng phí": dp.tong_dang_phi || 0,
      "Đã thu": dp.da_thu || 0,
      "Chưa đóng": dp.tong_dang_phi - (dp.da_thu || 0) || 0,
    }));
    const ws1 = XLSX.utils.json_to_sheet(phanI);
    XLSX.utils.book_append_sheet(wb, ws1, "PHẦN I - Thu đảng phí");

    // --- PHẦN II ---
    const phanII = tongHopTheoThang.map((m) => ({
      Tháng: m.thang,
      "Tổng số đảng viên": m.soDangVien,
      "Được miễn": m.soMien,
      "Chưa đóng": m.chuaDong,
      "Đã thu": m.daThu,
      "Trích giữ lại": m.trichGiu,
      "Phải nộp cấp trên": m.phaiNop,
      "Đã nộp": m.daNop,
      "Chưa nộp": m.chuaNop,
    }));

    // Thêm tổng quý
    const quyList = [
      { ten: "Cộng quý I", data: quy1 },
      { ten: "Cộng quý II", data: quy2 },
      { ten: "Cộng quý III", data: quy3 },
      { ten: "Cộng quý IV", data: quy4 },
      { ten: "Cộng cả năm", data: tongNam },
    ];

    const phanIIFull = [
      ...phanII,
      ...quyList.map((q) => ({
        Tháng: q.ten,
        "Tổng số đảng viên": q.data.soDangVien,
        "Được miễn": q.data.soMien,
        "Chưa đóng": q.data.chuaDong,
        "Đã thu": q.data.daThu,
        "Trích giữ lại": q.data.trichGiu,
        "Phải nộp cấp trên": q.data.phaiNop,
        "Đã nộp": q.data.daNop,
        "Chưa nộp": q.data.chuaNop,
      })),
    ];

    const ws2 = XLSX.utils.json_to_sheet(phanIIFull);
    XLSX.utils.book_append_sheet(wb, ws2, "PHẦN II - Tổng hợp");

    // Xuất file
    XLSX.writeFile(wb, `SoThuNopDangPhi_${selectedNam}.xlsx`);
  };

  if (loading) return <div className="p-6 text-center">Đang tải sổ thu nộp đảng phí...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white border border-[#ccc] rounded-[5px] text-[13px]">
      {/* Header và bộ lọc */}
      <div className="mb-4">
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-[13px]"
        >
          Xuất Excel
        </button>
      </div>

      <div className="w-full text-center font-bold text-[16px] mb-4">SỔ THU, NỘP ĐẢNG PHÍ</div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div>
            <label className={label}>Tháng</label>
            <select value={selectedThang} onChange={(e) => setSelectedThang(Number(e.target.value))} className={input}>
              <option value={0}>Tất cả</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Năm</label>
            <input
              type="number"
              value={selectedNam}
              onChange={(e) => setSelectedNam(Number(e.target.value))}
              className={input}
              min="2000"
              max="2100"
            />
          </div>
        </div>

        <button
          onClick={loadData}
          className="bg-[#2f6fb3] text-white px-4 py-1.5 rounded hover:bg-[#1e5a9a] text-[13px]"
        >
          Tải lại dữ liệu
        </button>
      </div>

      {/* PHẦN I - THU ĐẢNG PHÍ */}
      <div className="mb-12">
        <div className="font-bold mb-2">PHẦN I - THU ĐẢNG PHÍ</div>

        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className={th} rowSpan={2}>
                Stt
              </th>
              <th className={th} rowSpan={2}>
                Họ và tên đảng viên
              </th>
              <th className={th} rowSpan={2}>
                Được miễn
              </th>
              <th className={th} rowSpan={2}>
                Tháng/năm
              </th>
              <th className={th} rowSpan={2}>
                Thu nhập tính đóng đảng phí
              </th>
              <th className={th} colSpan={3}>
                Số tiền đảng phí phải đóng
              </th>
              <th className={th} rowSpan={2}>
                Số tiền đảng phí đã thu
              </th>
              <th className={th} rowSpan={2}>
                Số tiền đảng phí chưa đóng đến cuối tháng
              </th>
            </tr>
            <tr>
              <th className={th}>Tháng này</th>
              <th className={th}>Truy thu các tháng trước</th>
              <th className={th}>Cộng</th>
            </tr>
          </thead>
          <tbody className="">
            {dangPhiList.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  Không có dữ liệu đảng phí cho tháng/năm này
                </td>
              </tr>
            ) : (
              dangPhiList.map((dp: any, index) => {
                const now = new Date();
                const currentMonth = now.getMonth(); // 0 = Jan
                const currentYear = now.getFullYear();

                const mien = dp.dangvien_phi_id?.mien_dang_phi?.some((m: any) => {
                  const from = new Date(m.tu_ngay);
                  const to = m.den_ngay ? new Date(m.den_ngay) : new Date(8640000000000000); // nếu null thì vô hạn

                  // Check nếu tháng hiện tại nằm trong khoảng from → to
                  const fromMonth = from.getMonth();
                  const fromYear = from.getFullYear();
                  const toMonth = to.getMonth();
                  const toYear = to.getFullYear();

                  const startOK = currentYear > fromYear || (currentYear === fromYear && currentMonth >= fromMonth);
                  const endOK = currentYear < toYear || (currentYear === toYear && currentMonth <= toMonth);

                  return startOK && endOK;
                });
                let last = false;

                return (
                  <tr key={dp._id} className={` `}>
                    <td className={`${td} `}>{index + 1}</td>
                    <td className={`${td} text-left`}>{dp.dangvien_phi_id?.dang_vien_id?.ho_ten || "N/A"}</td>
                    <td className={td}>{mien ? "X" : "-"}</td>
                    <td className={td}>
                      {dp.thang}/{dp.nam}
                    </td>
                    <td className={td}>{dp.thu_nhap?.toLocaleString("vi-VN") || 0}</td>
                    <td className={td}>{dp.dang_phi?.toLocaleString("vi-VN") || 0}</td>
                    <td className={td}>{dp.truy_thu?.toLocaleString("vi-VN") || 0}</td>
                    <td className={td}>{dp.tong_dang_phi?.toLocaleString("vi-VN") || 0}</td>
                    <td className={td}>{dp.da_thu?.toLocaleString("vi-VN") || 0}</td>
                    {/* giả sửã thu hết */}
                    <td className={`${td}`}>{(dp.tong_dang_phi - (dp.da_thu || 0))?.toLocaleString("vi-VN") || 0}</td>
                    {/* chưaóng */}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="mt-2 text-[12px] italic">
          Ghi chú: Đảng viên miễn đóng đảng phí thì đánh dấu (X) vào cột "Được miễn", không ghi số tiền vào cột thu nhập
          và đảng phí.
        </div>
      </div>

      {/* PHẦN II - TỔNG HỢP */}
      <div>
        <div className="font-bold mb-2">PHẦN II: TỔNG HỢP THU, NỘP ĐẢNG PHÍ HÀNG THÁNG - Mẫu sổ S01/ĐP</div>
        <div className="font-semibold">NĂM: {selectedNam}</div>

        <table className="w-full border-collapse border mt-4">
          <thead>
            <tr>
              <th className={th} rowSpan={2}>
                Ngày tháng năm nộp
              </th>
              <th className={th} rowSpan={2}>
                Thu đảng phí tháng
              </th>
              <th className={th} colSpan={2}>
                Tình hình đảng viên
              </th>
              <th className={th} colSpan={4}>
                Tình hình đảng phí
              </th>
              <th className={th} colSpan={3}>
                Nộp đảng phí lên cấp trên
              </th>
              {/* <th className={th} rowSpan={2}>
                Người nhận (người thu đảng phí)
              </th> */}
            </tr>
            <tr>
              <th className={th}>Tổng số đảng viên đến cuối tháng</th>
              <th className={th}>Tổng số đảng viên được miễn</th>
              <th className={th}>Số tiền đảng phí chưa đóng</th>
              <th className={th}>Số tiền đảng phí đã thu</th>
              <th className={th}>Đảng phí được trích giữ lại</th>
              <th className={th}>Đảng phí phải nộp cấp trên</th>
              <th className={th}>Đảng phí đã nộp cấp trên</th>
              <th className={th}>Đảng phí chưa nộp cấp trên</th>
            </tr>
          </thead>
          <tbody>
            {tongHopTheoThang.map((m) => (
              <tr key={m.thang}>
                {/* <td className={td}></td> ngày nộp */}
                <td className={td}>Tháng {m.thang}</td>
                <td className={td}>{m.soDangVien}</td>
                <td className={td}>{m.soMien}</td>
                <td className={td}>{m.chuaDong.toLocaleString("vi-VN")}</td>
                <td className={td}>{m.daThu.toLocaleString("vi-VN")}</td>
                <td className={td}>{m.trichGiu.toLocaleString("vi-VN")}</td>
                <td className={td}>{m.phaiNop.toLocaleString("vi-VN")}</td>
                <td className={td}>{m.daNop.toLocaleString("vi-VN")}</td>
                <td className={td}>{m.chuaNop.toLocaleString("vi-VN")}</td>
                {/* <td className={td}></td> người nhận */}
              </tr>
            ))}

            {/* Quý */}
            {[
              { ten: "Cộng quý I", data: quy1 },
              { ten: "Cộng quý II", data: quy2 },
              { ten: "Cộng quý III", data: quy3 },
              { ten: "Cộng quý IV", data: quy4 },
              { ten: "Cộng cả năm", data: tongNam },
            ].map((q, i) => (
              <tr key={i} className="font-semibold bg-[#f0f8ff]">
                <td className={td} colSpan={2}>
                  {q.ten}
                </td>
                <td className={td}>{q.data.soDangVien}</td>
                <td className={td}>{q.data.soMien}</td>
                <td className={td}>{q.data.chuaDong.toLocaleString("vi-VN")}</td>
                <td className={td}>{q.data.daThu.toLocaleString("vi-VN")}</td>
                <td className={td}>{q.data.trichGiu.toLocaleString("vi-VN")}</td>
                <td className={td}>{q.data.phaiNop.toLocaleString("vi-VN")}</td>
                <td className={td}>{q.data.daNop.toLocaleString("vi-VN")}</td>
                <td className={td}>{q.data.chuaNop.toLocaleString("vi-VN")}</td>
                <td className={td}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// fixduy
// neu con 1 cai luong cs cuoi cung ko cho xoa
