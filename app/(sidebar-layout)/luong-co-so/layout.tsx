import SidebarLayout from "@/components/layout/sidebar-layout";

const navItems = [
  { label: "Đảng phí", href: "/dang-phi" },
  { label: "Cập nhật thông tin đảng viên", href: "/dang-vien-phi" },
  { label: "Hệ số lương", href: "/he-so-luong" },
  { label: "Lương cơ sở", href: "/luong-co-so" },
  { label: "Sổ thu nộp đảng phí", href: "/so-thu-nop-dang-phi" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout navItems={navItems}>{children}</SidebarLayout>;
}
