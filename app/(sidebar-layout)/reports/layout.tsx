import SidebarLayout from "@/components/layout/sidebar-layout";

// const navItems = [
//   { label: "Quản lý báo cáo, nghị quyết", href: "/reports" },
//   { label: "Quản lý loại", href: "/reports/types" },
//   { label: "Quản lý mã báo cáo", href: "/reports/codes" },
// ];
const navItems = [
  { label: "Tài liệu", href: "/reports" },
  { label: "Loại tài liệu", href: "/reports/types" },
  { label: "Danh mục tài liệu", href: "/reports/codes" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout navItems={navItems}>{children}</SidebarLayout>;
}
