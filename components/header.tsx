import Link from "next/link";

function Headers() {
  return (
    <>
      <div>
        <div
          className="w-full shadow bg-black "
          style={{
            backgroundImage:
              "url('https://accounts.ctu.edu.vn/authenticationendpoint/extensions/layouts/custom/carbon.super/assets/images/bg_banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Link href={"/"}>
            {" "}
            <img
              src="https://accounts.ctu.edu.vn/authenticationendpoint/extensions/layouts/custom/carbon.super/assets/images/banner.png"
              alt="banner"
              className="w-300 object-cover mx-auto "
            />
          </Link>
        </div>
        <div className="border-t border-gray-200 w-full my-3"></div>
      </div>
    </>
  );
}

export default Headers;
