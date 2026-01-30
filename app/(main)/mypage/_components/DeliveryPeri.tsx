"use client";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import { SubscriptIcon } from "lucide-react";

export default function DeliveryPeri({}) {
  return (
    <>
      <div className="  flex flex-col items-start self-stretch gap-[28px] p-[35px] rounded-[42px] border border-black/5 bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.03)]">
        <div className="flex flex-row gap-[11px] ">
          <SubscriptIcon className=" text-[#FBA613] bg-[#FFF5E6]" />
          <h1 className="font-['Inter'] text-[17px] font-[900]  text-[#1A1A1C] rounded-2xl">
            배송 주기 변경
          </h1>
        </div>

        {/* {활성화 된 버튼} */}
        <Button
          className="w-full rounded-[25.2px] border-[2px] border-black/5 bg-white  flex justify-between"
          size="lg"
          variant="ghost"
        >
          <div className=" flex flex-col items-start grow-1 ">
            <p className=" font-['Inter'] text-[12px] font-[900]  text-[#909094] ">
              격주 배송 (2주)
            </p>
            <p className=" font-['Inter'] text-[10px] font-bold  text-[#909094] opacity-60">
              보편적인 식사량이에요
            </p>
          </div>
          <Checkbox label="" />
        </Button>

        {/* {활성화 되지 않은 버튼} */}
        <Button
          className="w-full rounded-[25.2px] border-[2px] border-black/5 bg-white  flex justify-between"
          size="lg"
          variant="ghost"
        >
          <div className="flex flex-col items-start grow-1">
            <p className="font-['Inter'] text-[12px] font-[900]  text-[#909094]">매달 배송 (4주)</p>
            <p className="font-['Inter'] text-[10px] font-bold text-[#909094] opacity-60">
              가장 많이 선택하시는 주기에요
            </p>
          </div>
          <Checkbox label="" />
        </Button>
      </div>
    </>
  );
}
