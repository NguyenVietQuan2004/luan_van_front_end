import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const menuItems = [
  {
    label: "Quản lý báo cáo\nnghị quyết",
    src: "https://dkmh.ctu.edu.vn/htql/sinhvien/images/phanhe/hetinchi.gif",

    // src: "https://dkmh.ctu.edu.vn/htql/sinhvien/images/phanhe/korganizer.png",
    href: "/reports",
  },
  // {
  //   label: "Nghị quyết",
  //   src: "https://dkmh.ctu.edu.vn/htql/sinhvien/images/phanhe/hetinchi.gif",
  //   href: "/nghi-quyet",
  // },
  {
    label: "Trích xuất\nthông tin lý lịch",
    src: "https://icons.iconarchive.com/icons/trayse101/photoshop-filetypes/128/profile-icon.png",
    href: "/syllabus",
  },
  {
    label: "Đảng phí",
    src: "https://icons.iconarchive.com/icons/hopstarter/sleek-xp-basic/128/Money-icon.png",
    href: "/so-thu-nop-dang-phi",
  },
  {
    label: "Đảng viên",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/bf/L%C3%A1_c%E1%BB%9D_c%E1%BB%A7a_%C4%90%E1%BA%A3ng_c%E1%BB%99ng_s%E1%BA%A3n_Vi%E1%BB%87t_Nam.png",
    href: "/dang-vien",
  },
  {
    label: "Cảm tình đảng",
    src: "https://dkmh.ctu.edu.vn/htql/sinhvien/images/phanhe/ql_diem.gif",
    href: "/applicants",
  },

  {
    label: "Cuộc thi",
    src: "https://icons.iconarchive.com/icons/treetog/junior/128/folder-blue-award-icon.png",
    href: "/cuoc-thi",
  },

  {
    label: "Thông báo công văn\nđến các đảng viên",
    src: "https://icons.iconarchive.com/icons/pelfusion/flat-folder/128/Notification-Folder-icon.png",
    href: "/thong-bao",
  },
  {
    label: "Tạo biên bản\ncuộc họp",
    src: "https://icons.iconarchive.com/icons/dakirby309/simply-styled/128/Microsoft-Word-2013-icon.png",
    href: "/bien-ban",
  },
];

export default function HomePage() {
  return (
    <div className="  bg-white border border-solid border-[#ccc] rounded-[5px]   flex-1 p-3.75 grid grid-cols-1 lg:grid-cols-2 gap-4 text-base">
      <Card className="bg-white shadow-none ring-0 border border-[#ccc] rounded-[5px]">
        <CardContent className="p-3 shadow-none  space-y-3">
          <h2 className="font-semibold text-[#3872b2] border-b pb-1">GIỚI THIỆU HỆ THỐNG</h2>

          <p className="text-sm text-gray-700 text-justify leading-relaxed">
            Trong quá trình thực hiện các nhiệm vụ chuyên môn và quản lý, giảng viên thường phải đảm nhiệm nhiều hoạt
            động hành chính liên quan đến công tác Đảng vụ. Các quy trình như quản lý hồ sơ, theo dõi sinh hoạt chi bộ,
            tổng hợp báo cáo định kỳ hay xử lý văn bản vẫn còn mang tính thủ công, gây tốn nhiều thời gian và dễ phát
            sinh sai sót.
          </p>

          <p className="text-sm text-gray-700 text-justify leading-relaxed">
            Hệ thống "Quản lý Đảng vụ KHMT" được xây dựng nhằm hỗ trợ tự động hóa các quy trình xử lý thông tin, giúp
            nâng cao hiệu quả quản lý, giảm tải công việc hành chính và đảm bảo tính chính xác trong quá trình vận hành.
          </p>

          <div>
            <h3 className="font-semibold text-[#3872b2] mb-1">Mục tiêu chính</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Quản lý tập trung thông tin đảng viên và cảm tình Đảng</li>
              <li>Tự động hóa xử lý hồ sơ và dữ liệu hành chính</li>
              <li>Hỗ trợ lập báo cáo, nghị quyết nhanh chóng</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#3872b2] mb-1">Chức năng nổi bật</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Quản lý thông tin đảng viên, cảm tình Đảng, báo cáo, nghị quyết</li>
              <li>Quản lý đảng phí và quá trình thu nộp</li>
              <li>Theo dõi hoạt động, cuộc họp và cuộc thi</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#3872b2] mb-1">Các chức năng nổi bậc</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Tự động trích xuất thông tin từ file lý lịch</li>
              <li>Tóm tắt nội dung công văn, thông báo</li>
              <li>Tự động tạo biên bản họp từ nội dung nhập tự do</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-none ring-0 border! p-0 border-solid border-[#ccc] rounded-[5px]">
        <CardContent className="p-1.25 shadow-none">
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="flex select-none flex-col items-center justify-center  rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="mb-0.5">
                  <img alt="" className="w-12 h-12" src={item.src} />
                </div>
                <span className="text-base text-center  whitespace-pre-line">{item.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
