import React from "react";

function Hero() {
  return (
    <div className="h-[85vh] md:h-screen relative">
      <img
        src="img/logo.png"
        alt=""
        className="absolute z-10 top-28 md:top-10 left-1/2 -translate-x-1/2 h-44 md:h-60 lg:h-72"
      />
      <div className="absolute inset-0 z-20 bg-linear-to-t from-white/70 via-40% to-70% via-white/10"></div>
    </div>
  );
}

export default Hero;
