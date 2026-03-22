import Footer from "@/components/footer";
import Headers from "@/components/header";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen   flex bg-[#e8f4ff] flex-col">
      <Headers />
      <div className="w-242.5 mx-auto">{children}</div>
      <Footer />
    </div>
  );
}
