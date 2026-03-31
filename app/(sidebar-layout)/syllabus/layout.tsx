import SidebarLayout from "@/components/layout/sidebar-layout";

const navItems = [
  // { label: "Danh sách cảm tình đảng", href: "/applicants" },
  { label: "", href: "/" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout navItems={navItems}>{children}</SidebarLayout>;
}
