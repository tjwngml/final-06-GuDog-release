"use client";
import { InputHTMLAttributes } from "react";

import Link from "next/link";

interface MyItemListProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  title: string;
  content: string;
  image: React.ReactElement; // 아이콘 컴포넌트
  href?: string;
  price: string;
  mark: React.ReactElement;
  period?: string;
  date?: string;
  className?: string;
  orderId?: string;
  subscriptionId?: string;
}

export default function MyItemList({
  title,
  image,
  href,
  content,
  date,
  period,
  price,
  mark,
  className = "",
  orderId = "1",
  subscriptionId = "1",
}: MyItemListProps) {
  // 마우스 올렸을 때 스타일 변화

  const getHref = () => {
    if (content === "리뷰 작성") {
      return `/mypage/order/${orderId}/review`;
    }
    if (content === "상세 보기") {
      return `/mypage/subscription/${subscriptionId}`;
    }
    return "#"; // 기본값
  };

  return (
    <>
      <div
        className={`rounded-[42px] border border-[rgba(0,0,0,0.06)] bg-[#FFFFFF] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] ${className}`}
      >
        <div className="mt-[30px] ml-[30px] mr-[30px]">{image}</div>
        <div className="pt-[27px] pl-[29px] pb-[14.5px] text-[#1A1A1C]  text-[18px] font-black ">
          {title}
        </div>
        <div className="flex px-[29px] justify-between">
          <p className="text-[#909094] text-[12px] font-medium">주문일</p>
          <p className="text-[#646468]">{date}</p>
        </div>
        <div className="flex my-[7px] px-[29px] justify-between">
          <p className="text-[#909094] text-[12px] font-medium">주기</p>
          <p className="text-[#646468]">{period}</p>
        </div>
        <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)] " />
        <div className="pb-9 pt-[15px] flex pl-[29px] justify-between pr-[29px] ">
          <p className="text-[#1A1A1C] text-[12px] font-black">결제금액</p>
          <p className="text-[#FBA613] text-[12px] font-black">{price}</p>
        </div>
        <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)] " />

        <Link
          className="flex justify-center gap-[12px] items-center px-[29px] py-[20px]"
          href={getHref()}
        >
          <span className="text-[#FBA613] text-center text-[11px] font-black">{content}</span>
          <span>{mark}</span>
        </Link>
      </div>
    </>
  );
}
