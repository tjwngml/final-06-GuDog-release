"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Button from "@/components/common/Button";

export default function HeroSwiper() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      speed={1000}
      loop={true}
      allowTouchMove={false}
      className="w-full h-auto"
    >
      <SwiperSlide>
        <div className="relative w-full h-full bg-[#FFF9F2] flex items-center justify-center">
          <img src="/images/main-visual01.png" alt="" className="w-full h-full object-cover" />
          <Button
            href="/survey"
            className="absolute left-1/2 top-[32%] -translate-x-1/2 text-[2vw] md:text-base px-[3vw] md:px-7 py-[1.5vw] md:py-3.5"
            rightIcon
          >
            설문 하기
          </Button>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="w-full h-full bg-[#FFF9F2] flex items-center justify-center">
          <img src="/images/main-visual02.png" alt="" className="w-full h-full object-cover" />
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
