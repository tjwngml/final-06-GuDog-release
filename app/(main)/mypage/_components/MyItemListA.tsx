"use client";

import { InputHTMLAttributes } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MyItemListProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  title: string;
  content: string;
  image: React.ReactElement;
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
  quantity,
  className = "",
  orderId = "1",
  subscriptionId = "1",
  productid,
  isReviewed = false,
}: MyItemListProps) {
  const router = useRouter();

  const getHref = () => {
    if (isReviewed) return;

    if (content === "리뷰 작성") {
      router.push(`/mypage/order/${orderId}/review?productid=${productid}`);
    }
    if (content === "상세 보기") {
      router.push(`/mypage/subscription/${subscriptionId}`);
    }
    return "#";
  };

  return (
    <div
      className={`rounded-[42px] border border-[rgba(0,0,0,0.06)] bg-[#FFFFFF] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] ${className}`}
    >
      <div className="mt-[30px] ml-[30px] mr-[30px]">{image}</div>
      <div className="pt-[27px] pl-[29px] pb-[14.5px] text-[#1A1A1C] text-[18px] font-black ">
        {title}
      </div>

      <div className="flex px-[29px] justify-between">
        <p className="text-[#909094] text-[12px] font-medium">주문일</p>
        <p className="text-[#646468] text-[12px]">{date}</p>
      </div>

      <div className="flex mt-[7px] px-[29px] justify-between">
        <p className="text-[#909094] text-[12px] font-medium">수량</p>
        <p className="text-[#646468] text-[12px]">{quantity}개</p>
      </div>

      <div className="flex my-[7px] px-[29px] justify-between">
        <p className="text-[#909094] text-[12px] font-medium">주기</p>
        <p className="text-[#646468] text-[12px]">{period}</p>
      </div>

      <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)] " />
      <div className="pb-9 pt-[15px] flex pl-[29px] justify-between pr-[29px] ">
        <p className="text-[#1A1A1C] text-[12px] font-black">결제금액</p>
        <p className="text-[#FBA613] text-[12px] font-black">{price}</p>
      </div>
      <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)] " />

      <button
        className="w-full flex justify-center gap-[12px] items-center px-[29px] py-[20px]"
        onClick={getHref}
      >
        <div
          className={`text-center text-[11px] font-black leading-4 ${
            isReviewed ? "text-[#909094]" : "text-[#FBA613]"
          }`}
        >
          {isReviewed ? "리뷰 등록 완료" : content}
        </div>{" "}
        <span className="flex items-center">{mark}</span>
      </button>
    </div>
  );
}
