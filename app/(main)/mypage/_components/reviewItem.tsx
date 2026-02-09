"use client";

import { Children, InputHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/common/Badge";
import { OrderStateCode } from "@/types/codes";

interface MyReviewListProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  name: string;
  content?: string;
  image: string;
  href?: string;
  price: string;
  mark?: React.ReactElement | null;
  period?: string;
  date?: string;
  quantity?: number; // 수량 타입 추가
  className?: string;
  orderId?: string;
  subscriptionId?: string;
  productid?: number;
  isReviewed?: boolean; // 리뷰 완료 여부 추가
  state?: OrderStateCode;
}

export default function MyReviewList({
  name,
  image,
  date,
  price,
  className = "",
  productid,
  state,
}: MyReviewListProps) {
  console.log(productid, "프로덕트아이디");

  return (
    <div
      className={`w-full rounded-[42px] overflow-hidden flex flex-row items-center border border-[rgba(0,0,0,0.06)] bg-[#FFFFFF] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] ${className}`}
    >
      <div></div>
      <div className="mt-[30px] ml-[28px] mt-[35px] mb-[28px] mr-[30px] w-[82px] h-[82px] overflow-hidden rounded-[14px] ">
        <img src={image} alt={name} />
      </div>

      <div className="flex flex-col justify-start flex-1">
        <div className="flex   ">
          <p className="text-[#FBA613]  text-[10px] font-[900] ">주문일 : {date}</p>
          {/* <p className="text-[#FBA613]  text-[10px] font-[900] ">{date}</p> */}
        </div>

        <div className="mt-[3px] mb-[4px] text-[#1A1A1C] text-[18px] font-black ">{name}</div>

        <div className="  flex  ">
          <p className="text-[#909094] text-[12px] font-black">{price}</p>
        </div>
      </div>
      <div className="pr-[28px]">
        <Badge variant="status">{state}</Badge>
      </div>
    </div>
  );
}
