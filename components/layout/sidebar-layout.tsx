"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Open_Sans } from "next/font/google";

type NavItem = {
  label: string;
  href: string;
};

const openSans = Open_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});
export default function SidebarLayout({ children, navItems }: { children: ReactNode; navItems: NavItem[] }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  return (
    <div className={`h-screen flex flex-col bg-[#e7edf4]`}>
      <header className={`h-20 bg-[#2d63ad] flex items-center px-6 text-white  ${openSans.className}`}>
        <button onClick={() => setOpen(!open)}>
          <Menu size={24} />
        </button>

        <div className=" text-3xl font-semibold">
          <Link href={"/"} className=" flex items-center">
            <img
              src="https://dkmhfe.ctu.edu.vn/static/media/logo.e5e97ff84ce962c657d2.png"
              alt=""
              className="w-12 h-12 mx-4"
            />
            CTU
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={`absolute mt-6 rounded-xl left-0 top-0 h-full w-64 bg-white border-r
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* bg-[#f1f4f8] */}
          <nav className="p-4 space-y-2 text-sm">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-all duration-300 block px-4 py-2 rounded-lg hover:bg-gray-200 ${pathname === item.href ? "bg-[#e6f4ff] text-[#1e5aaa]" : "hover:bg-gray-200"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main
          className={`flex-1 p-6 overflow-auto transition-all duration-300
          ${open ? "ml-64" : "ml-0"}`}
        >
          <div className="bg-white rounded-2xl shadow p-6 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
