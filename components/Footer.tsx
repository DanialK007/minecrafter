import React from "react";

function Footer() {
  return (
    <div className="h-[80vh] flex flex-col justify-end bg-linear-to-b from-white/70 to-white/30">
      <div className="flex justify-between px-2 py-3 text-sm md:text-base">
        <div className="">All Rights Reserved © 2024</div>
        <div className="">
          Developed by <a className="font-semibold hover:underline hover:text-amber-700" href="https://www.kaungkhantkyaw.online/">Danial</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
