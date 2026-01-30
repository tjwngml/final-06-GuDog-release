"use client";

import Badge from "@/components/common/Badge";
import Link from "next/link";

interface DetailSubProps {
  title: string;
  image: React.ReactElement; // 이미지 컴포넌트
  price: string;
}

export default function DetailSub({ title, image, price }: DetailSubProps) {
  return (
    <>
      <div className="  rounded-[49px] border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] p-8 ">
        <div className="max-w-[259px] mx-auto overflow-hidden rounded-3xl flex justify-center items-center">
          {image}
        </div>
        <div className="flex justify-center  pb-[14px] ">
          <Badge className="mt-[28px]" variant="status">
            {"구독중"}
          </Badge>
        </div>
        <div className="mt-[14px] text-[#1A1A1C] font-['Inter'] text-[20px]  font-[900] ">
          {title}
        </div>
        <div className="mt-[14px] h-[1px] bg-[rgba(0,0,0,0.06)] mx-auto " />
        <div className="pt-[14px] flex flex-row justify-between">
          <p className="text-[#646468] font-['Inter'] text-[12px] not-italic font-bold  pt-[22px]">
            월 정기 결제액
          </p>
          <p className="text-[#FBA613] font-['Inter'] text-[20px] not-italic font-[900]  pt-[14px]">
            {price}
          </p>
        </div>
      </div>
    </>
  );
}
