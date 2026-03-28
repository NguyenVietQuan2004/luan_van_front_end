"use client";

import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";

type ContestStat = {
  party_member_id: string;
  ho_ten: string;
  contest_name: string;
  month: number;
  year: number;
  title?: string | null;
  rank?: number | null;
  score?: number | null;
};

export default function ContestStatsPage() {
  const [stats, setStats] = useState<ContestStat[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FILTER STATES =================
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  const loadStats = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/contest-stats`);
    const json = await res.json();
    setStats(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ================= FILTERED DATA =================
  const filteredStats = useMemo(() => {
    return stats.filter((item) => {
      const matchMonth = selectedMonth === "all" || item.month === selectedMonth;
      const matchYear = selectedYear === "all" || item.year === selectedYear;
      return matchMonth && matchYear;
    });
  }, [stats, selectedMonth, selectedYear]);

  // ================= GROUP FILTERED DATA =================
  const grouped = useMemo(() => {
    return Object.values(
      filteredStats.reduce((acc: any, item) => {
        if (!acc[item.party_member_id]) {
          acc[item.party_member_id] = {
            ho_ten: item.ho_ten,
            items: [],
          };
        }
        acc[item.party_member_id].items.push(item);
        return acc;
      }, {}),
    );
  }, [filteredStats]);

  const exportToExcel = () => {
    const excelData: any[] = [];

    grouped.forEach((group: any) => {
      group.items.forEach((row: ContestStat) => {
        excelData.push({
          "Đảng viên": group.ho_ten, // Lặp lại tên để dễ nhìn
          "Cuộc thi": row.contest_name,
          Tháng: row.month,
          Năm: row.year,
          "Thời gian": `${row.month}/${row.year}`, // Thêm cột này cho rõ ràng
          "Danh hiệu": row.title || "-",
          Hạng: row.rank ?? "-",
          Điểm: row.score ?? "-",
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(excelData);

    // Tùy chọn: Định dạng lại độ rộng cột cho đẹp
    const colWidths = [
      { wch: 25 }, // Đảng viên
      { wch: 30 }, // Cuộc thi
      { wch: 8 }, // Tháng
      { wch: 8 }, // Năm
      { wch: 12 }, // Thời gian
      { wch: 20 }, // Danh hiệu
      { wch: 10 }, // Hạng
      { wch: 12 }, // Điểm
    ];
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ThongKe");

    XLSX.writeFile(wb, "Thong_ke_cuoc_thi.xlsx");
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  const years = Array.from(new Set(stats.map((s) => s.year))).sort((a, b) => b - a);
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className=" text-sm mx-auto p-6 bg-white border-[#ccc] rounded-[5px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#232934]">Thống kê tham gia cuộc thi</h1>

        <button
          onClick={exportToExcel}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded"
        >
          Xuất Excel
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex gap-4 mb-6 bg-gray-50 p-4 rounded border">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Năm</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Tháng</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả tháng</option>
            {months.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedMonth("all");
              setSelectedYear("all");
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded hover:bg-gray-100"
          >
            Xóa filter
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border text-[13px]">
        <thead>
          <tr className="bg-[#e6edf5]">
            <th className="border px-3 py-2">Đảng viên</th>
            <th className="border px-3 py-2">Cuộc thi</th>
            <th className="border px-3 py-2">Thời gian</th>
            <th className="border px-3 py-2">Danh hiệu</th>
            <th className="border px-3 py-2">Hạng</th>
            <th className="border px-3 py-2">Điểm</th>
          </tr>
        </thead>

        <tbody>
          {grouped.map((group: any) =>
            group.items.map((row: ContestStat, index: number) => (
              <tr key={row.party_member_id + index}>
                {index === 0 && (
                  <td rowSpan={group.items.length} className="border px-3 py-2 font-medium align-middle">
                    {group.ho_ten}
                  </td>
                )}

                <td className="border px-3 py-2">{row.contest_name}</td>

                <td className="border px-3 py-2 text-center">
                  {row.month}/{row.year}
                </td>

                <td className="border px-3 py-2">
                  {row.title || <span className="text-gray-400 italic">Không có</span>}
                </td>

                <td className="border px-3 py-2 text-center">{row.rank ?? "-"}</td>
                <td className="border px-3 py-2 text-center">{row.score ?? "-"}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>

      {grouped.length === 0 && (
        <div className="text-center py-10 text-gray-500">Không có dữ liệu phù hợp với bộ lọc</div>
      )}
    </div>
  );
}
