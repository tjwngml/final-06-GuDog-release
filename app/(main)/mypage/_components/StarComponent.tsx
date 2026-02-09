"use client";

import { StarFillIcon } from "@/app/(main)/mypage/_components/Icons";

interface StarComponentProps {
  rating: number;
  setRating: (score: number) => void; // 점수를 변경하는 함수
}

export default function StarComponent({ rating, setRating }: StarComponentProps) {
  const array = [1, 2, 3, 4, 5];

  const labels: Record<number, string> = {
    0: "만족도를 선택해 주세요",
    1: "별로에요",
    2: "그저 그래요",
    3: "보통이에요",
    4: "좋아요!",
    5: "최고에요!",
  };

  return (
    <div className="flex flex-col items-center gap-[36px]">
      <p
        className={`font-inter text-[12px] font-black pt-[36px] ${
          rating === 0 ? "text-[#9CA3AF]" : "text-[#9CA3AF]"
        }`}
      >
        {rating === 0 ? "만족도를 선택해 주세요" : "만족도를 선택해 주세요"}
      </p>

      <div className="flex flex-row gap-2">
        {array.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`w-[42px] h-[42px] transition-all duration-300 transform hover:scale-110 ${
              rating >= num ? "text-[#FBA613]" : "text-[#F0F0F3]"
            }`}
          >
            <StarFillIcon className="w-full h-full" />
          </button>
        ))}
      </div>

      <p className="text-[#1A1A1C] font-inter text-[18px] font-[900] min-h-[24px]">
        {labels[rating]}
      </p>

      <div className="w-full lg:w-[532px] h-[1px] bg-black/5 mx-auto" />
    </div>
  );
}
