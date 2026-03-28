import SidebarLayout from "@/components/layout/sidebar-layout";

const navItems = [
  { label: "Cuộc thi", href: "/cuoc-thi" },
  { label: "Đăng ký cuộc thi", href: "/cuocthi-dangky" },
  { label: "Thống kê", href: "/cuoc-thi/stats" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout navItems={navItems}>{children}</SidebarLayout>;
}
