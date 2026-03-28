// @/lib/contestStats.ts

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000/api";

// Thống kê tổng quan (Dashboard)
export const fetchDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/api/contest-stats/dashboard`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Không lấy được thống kê tổng quan");
  return res.json();
};

// Thống kê theo năm
export const fetchYearlyStats = async () => {
  const res = await fetch(`${API_BASE}/api/contest-stats/yearly`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Không lấy được thống kê theo năm");
  return res.json();
};

// Thống kê theo tháng
export const fetchMonthlyStats = async (year?: number) => {
  const url = year ? `${API_BASE}/api/contest-stats/monthly?year=${year}` : `${API_BASE}/api/contest-stats/monthly`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Không lấy được thống kê theo tháng");
  return res.json();
};
export const fetchSomeThing = async (year?: number) => {
  const url = `${API_BASE}/api/contest-stats/participation-by-member`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Không lấy được thống kê theo tháng");
  return res.json();
};

// Thống kê theo từng đảng viên
export const fetchMemberStats = async (partyMemberId: string) => {
  const res = await fetch(`${API_BASE}/api/contest-stats/member/${partyMemberId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Không lấy được thống kê của đảng viên");
  return res.json();
};
