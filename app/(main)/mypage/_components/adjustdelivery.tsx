"use client";

import { CalendarIcon, MiniCalendarIcon } from "@/app/(main)/mypage/_components/Icons";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { SubscriptIcon } from "lucide-react";

export default function Adjustdelivery() {
  return (
    <>
      <div className="flex flex-row w-full">
        <div className="w-full flex flex-col items-start self-stretch p-[35px] rounded-[42px] border border-black/5 bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.03)]">
          <div className="w-full flex flex-row items-center gap-[11px] mb-[28px]">
            <CalendarIcon className=" text-[#3BB2F6] bg-[#EFF6FF] shrink-0" />
            <h1 className="w-full font-['Inter'] text-[17px] font-[900]  text-[#1A1A1C] rounded-2xl leading-none">
              다음 배송일 조정
            </h1>
          </div>

          {/* {활성화 된 버튼} */}
          <div className="w-full relative mb-[13px]">
            <Input type="date" className="" label="" placeholder="2026-02-16"></Input>
          </div>
          <p className="w-full text-[#909094] font-inter text-[10px] font-bold ">
            {" "}
            * 지정하신 날짜로부터 2-3일 내에 배송이 완료됩니다. (결제일 기준)
          </p>
        </div>
      </div>
    </>
  );
}
