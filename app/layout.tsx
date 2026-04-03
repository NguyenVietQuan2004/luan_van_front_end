import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Quản Lý Đảng Viên - KHMT",
  icons: {
    icon: "https://dkmhfe.ctu.edu.vn/static/media/logo.e5e97ff84ce962c657d2.png",
    apple: "https://dkmhfe.ctu.edu.vn/static/media/logo.e5e97ff84ce962c657d2.png",
    shortcut: "https://dkmhfe.ctu.edu.vn/static/media/logo.e5e97ff84ce962c657d2.png",
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="mdl-js">
      <body className="antialiased font-sans">
        {children}
        <Toaster
          toastOptions={{
            style: {
              fontSize: "18px",
              padding: "16px 24px",
              fontWeight: "bold",
            },
          }}
        />
      </body>
    </html>
  );
}
