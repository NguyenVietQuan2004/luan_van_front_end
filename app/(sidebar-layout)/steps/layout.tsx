import SidebarLayout from "@/components/layout/sidebar-layout";

const navItems = [
  { label: "Danh sách cảm tình đảng", href: "/applicants" },
  { label: "Danh sách các bước", href: "/steps" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout navItems={navItems}>{children}</SidebarLayout>;
}
