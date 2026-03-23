import Link from "next/link";
import React from "react";

interface ButtonAddNewType {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const ButtonAddNew: React.FC<ButtonAddNewType> = ({ href, className, children }) => {
  return (
    <Link
      href={href}
      //   className={`
      //     relative px-2.5 py-1.5
      //     text-white font-semibold
      //     rounded-[5px]
      //     bg-linear-to-r from-[#1E57A3] via-[#2A85C9] to-[#46A9E0]

      //     /* Đổ bóng Glow xanh giống trong ảnh */
      //     shadow-[0_0_5px_rgba(30,60,176,0.5)]
      //     hover:from-[#46A9E0] hover:via-[#2A85C9] hover:to-[#1E57A3]
      //     transition-all duration-1000 ease-in-out
      //     ${className}
      //   `}

      className={`
        /* Layout & Text */
        relative px-6 py-2 
        text-white font-semibold  
        rounded-[5px] 
        inline-flex items-center justify-center
        overflow-hidden

        /* KỸ THUẬT: Tạo background dài gấp đôi chứa cả 2 dải màu */
        bg-[linear-gradient(to_right,#1E57A3,#2A85C9,#46A9E0,#2A85C9,#1E57A3)]
        bg-size-[200%_100%]
        bg-position-[0%_0%]

        /* Đổ bóng Glow từ ảnh gốc */
        shadow-[0_0_5px_rgba(30,60,176,0.5)]
        
        /* HIỆU ỨNG VÀO: Di chuyển background thay vì đổi màu */
        transition-all duration-700 ease-in-out
        
        /* Khi Hover: Đẩy background sang phải 100% để hiện dải màu ngược */
        hover:bg-position-[100%_0%]
        hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]

        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default ButtonAddNew;
