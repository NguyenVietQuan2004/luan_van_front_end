import Link from "next/link";

function Headers() {
  return (
    <>
      <div className="w-full bg-white shadow">
        <Link href={"/"}>
          {" "}
          <img
            src="https://accounts.ctu.edu.vn/authenticationendpoint/extensions/layouts/custom/carbon.super/assets/images/banner.png"
            alt="banner"
            className="w-full object-cover"
          />
        </Link>
      </div>
      <div className="border-t border-gray-200 w-full my-3"></div>
    </>
  );
}

export default Headers;
