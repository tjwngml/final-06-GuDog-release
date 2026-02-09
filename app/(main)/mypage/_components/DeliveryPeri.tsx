"use client";

import Checkbox from "@/components/common/Checkbox";
import { SubscriptIcon } from "lucide-react";

interface Props {
  currentPeriod: string;
  onChange: (period: string) => void;
}

export default function DeliveryPeri({ currentPeriod, onChange }: Props) {
  // 배송 주기 옵션 데이터
  const options = [
    {
      id: "2weeks",
      title: "격주 배송 (2주)",
      description: "보편적인 식사량이에요",
      value: "2주 주기 배송",
    },
    {
      id: "4weeks",
      title: "매달 배송 (4주)",
      description: "가장 많이 선택하시는 주기에요",
      value: "4주 주기 배송",
    },
  ];

  return (
    <div className="flex flex-col items-start self-stretch gap-[28px] p-[35px] rounded-[42px] border border-black/5 bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.03)]">
      <div className="flex flex-row gap-[11px] ">
        <SubscriptIcon className="text-[#FBA613] bg-[#FFF5E6] p-1 rounded-md" />
        <h1 className="font-['Inter'] text-[17px] font-[900] text-[#1A1A1C]">배송 주기 변경</h1>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {options.map((option) => {
          const isSelected = currentPeriod === option.value;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.value)}
              className={`w-full rounded-[25.2px]  border-[2px] border-accent-primary p-6 flex justify-between items-center ${
                isSelected
                  ? "border-[#FBA613] bg-white"
                  : "border-black/5 bg-white hover:border-black/10"
              }`}
            >
              <div className="flex flex-col items-start text-left">
                <p
                  className={`font-['Inter'] text-[12px] font-[900] ${isSelected ? "text-[#FBA613]" : "text-[#909094]"}`}
                >
                  {option.title}
                </p>
                <p className="font-['Inter'] text-[10px] font-bold text-[#909094] opacity-60">
                  {option.description}
                </p>
              </div>

              <Checkbox label="" checked={isSelected} onChange={() => onChange(option.value)} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
