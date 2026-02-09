"use client";

import { CalendarIcon } from "@/app/(main)/mypage/_components/Icons";
import Input from "@/components/common/Input";

interface Props {
  value: string;
  onChange: (date: string) => void;
}

export default function Adjustdelivery({ value, onChange }: Props) {
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  return (
    <div className="flex flex-row w-full">
      <div className="w-full flex flex-col items-start self-stretch p-[35px] rounded-[42px] border border-black/5 bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.03)]">
        <div className="w-full flex flex-row items-center gap-[11px] mb-[28px]">
          <CalendarIcon className="text-[#3BB2F6] bg-[#EFF6FF] shrink-0 p-1 rounded-md" />
          <h1 className="w-full font-['Inter'] text-[17px] font-[900] text-[#1A1A1C] leading-none">
            다음 배송일 조정
          </h1>
        </div>

        <div className="w-full relative mb-[13px]">
          <Input
            min={todayDate}
            label=""
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="날짜를 선택해주세요"
          />
        </div>
        <p className="w-full text-[#909094] font-inter text-[10px] font-bold ">
          * 지정하신 날짜로부터 2-3일 내에 배송이 완료됩니다. (결제일 기준)
        </p>
      </div>
    </div>
  );
}
