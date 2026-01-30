"use client";

import { StarEmptyIcon, StarFillIcon } from "@/app/(main)/mypage/_components/Icons";
import { useState } from "react";

export default function StarComponent() {
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const array = [1, 2, 3, 4, 5];
  const lables: Record<number, string> = {
    1: "별로에요",
    2: "그저 그래요",
    3: "보통이에요",
    4: "좋아요!",
    5: "최고에요!",
  };

  return (
    <>
      <div className="flex flex-col items-center gap-[36px]">
        <p className="text-[#9CA3AF] font-inter text-[12px] font-black pt-[36px]">
          만족도를 선택해 주세요
        </p>
        <div className="flex flex-row gap-2">
          {array.map((num) => (
            <button
              key={num}
              onClick={() => setScore(num)}
              className={` w-[42px] h-[42px] hover:scale-120 transition-transform duration-300 text-[#F0F0F3]
          ${score >= num ? "text-[#FBA613]" : "text-[#F0F0F3]"}`}
            >
              <StarFillIcon />
            </button>
          ))}
        </div>
        <p className="text-[#1A1A1C] font-inter text-[16px] font-black ">{lables[score]}</p>
        <div className=" w-[532px] h-[1px] bg-[rgba(0,0,0,0.06)] mx-auto" />
      </div>
    </>
  );
}
