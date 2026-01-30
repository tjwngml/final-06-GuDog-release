import Adjustdelivery from "@/app/(main)/mypage/_components/adjustdelivery";
import DeliveryPeri from "@/app/(main)/mypage/_components/DeliveryPeri";
import DetailSub from "@/app/(main)/mypage/_components/DetailSub";
import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import { PrevIcon } from "@/app/(main)/mypage/_components/Icons";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Link from "next/link";

export default function SubscriptionEdit() {
  return (
    <div className="w-full min-w-[360px]">
      <div className="pt-[70px] pb-[70px] px-[20px] max-w-[1280px] mx-auto lg:px-0">
        <Link className="flex flex-row gap-[7px] mb-[35px]" href={"/mypage/subscription"}>
          <PrevIcon className="w-[17.5px] h-[17.5px] text-[#909094]" />
          <p className="text-[#909094] font-inter text-[11.7px] font-black uppercase">
            내 계정으로
          </p>
        </Link>

        <div className="flex flex-col items-center gap-[14px]">
          <Badge variant="accent">{"MANAGE PLAN"}</Badge>
          <h1 className="text-[#1A1A1C] text-center font-inter text-[39.5px] font-black ">
            정기 구독 플랜
          </h1>
          <p className="text-[#646468] text-center font-inter text-[14.7px] font-medium">
            아이의 식사량에 맞춰 배송 주기와 일정을 자유롭게 조절하세요.
          </p>
        </div>

        <div className=" flex flex-col lg:flex-row lg:justify-center pt-[35px] gap-[35px] items-center lg:items-start">
          <div className="w-full  lg:w-auto">
            <DetailSub title="고메 화식 패키지" image={<Product404 />} price="45,000 원" />
          </div>

          <div className="flex flex-col gap-[28px] w-full lg:max-w-none lg:flex-none lg:w-[486px]">
            <DeliveryPeri />
            <Adjustdelivery />

            <div className="flex flex-col gap-[12px]">
              <Button
                className="rounded-[28px] border-2 border-black/[0.06] w-full"
                size="md"
                variant="ghost"
              >
                구독 해지 신청
              </Button>
              <Button size="md" variant="primary" className="w-full">
                변경 사항 저장하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
