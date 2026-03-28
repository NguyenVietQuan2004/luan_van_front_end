import SidebarLayout from "@/components/layout/sidebar-layout";

// const navItems = [
//   { label: "Quản lý báo cáo, nghị quyết", href: "/reports" },
//   { label: "Quản lý loại", href: "/reports/types" },
//   { label: "Quản lý mã báo cáo", href: "/reports/codes" },
// ];
const navItems = [
  { label: "Loại báo cáo", href: "/reports/types" },
  { label: "Chi tiết loại báo cáo", href: "/reports/codes" },
  { label: "Báo cáo, nghị quyết", href: "/reports" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout navItems={navItems}>{children}</SidebarLayout>;
}
