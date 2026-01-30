"use client";
import { InputHTMLAttributes } from "react";

import Link from "next/link";
import { HeartIcon } from "@/app/(main)/mypage/_components/Icons";

interface MyItemListProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  title: string;

  image: React.ReactElement; // 아이콘 컴포넌트
  href: string;
  price: string;

  period?: string;
  date?: string;
  className?: string;
}

export default function WishlistComponent({
  title,
  image,
  href,

  date,
  period,
  price,

  className = "",
}: MyItemListProps) {
  return (
    <>
      <div
        className={`rounded-[42px] border border-[rgba(0,0,0,0.06)] bg-[#FFFFFF] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] ${className}`}
      >
        <div className="mt-[30px] ml-[30px] mr-[30px] ">{image}</div>
        <div className="flex justify-between items-center mt-[27px] px-[29px] pb-[14.5px]">
          <div className="text-[#1A1A1C] text-[18px] font-black">{title}</div>
          <button>
            <HeartIcon className="text-[#FBA613]" />
          </button>
        </div>
        <div className="flex pl-[29px] justify-between pr-[29px]">
          <p className="text-[#646468]">{date}</p>
        </div>
        <div className="pb-[7px] flex pl-[29px] justify-between pr-[29px]">
          <p className="text-[#646468]">{period}</p>
        </div>
        <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)] " />
        <div className="pb-[36px] pt-[15px] flex pl-[29px] justify-between pr-[29px] ">
          <p className=" text-[#1A1A1C] text-[12px] font-black">결제금액</p>
          <p className="text-[#FBA613] text-[12px] font-black ">{price}</p>
        </div>

        <Link
          className="pt-[20px] flex flex-row pl-[29px] justify-center gap-[12px]"
          href={"/Mydetail/Subplan"}
        ></Link>
      </div>
    </>
  );
}
