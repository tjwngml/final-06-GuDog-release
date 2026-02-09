"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { OrderDetailItem } from "@/app/(main)/mypage/(layout)/order/types/order";
import { PrevIcon } from "@/app/(main)/mypage/_components/Icons";
import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import DetailSub from "@/app/(main)/mypage/_components/DetailSub";
import DeliveryPeri from "@/app/(main)/mypage/_components/DeliveryPeri";
import Adjustdelivery from "@/app/(main)/mypage/_components/adjustdelivery";
import { updateSubscriptionPlan } from "@/app/(main)/mypage/(no-layout)/subscription/[subscriptionId]/editSub";

interface Props {
  initialData: OrderDetailItem;
  orderId: string;
}

export default function SubscriptionEditClient({ initialData, orderId }: Props) {
  const router = useRouter();
  const product = initialData.products[0];

  const [deteletedPeriod, setDeletedPeriod] = useState(initialData.period);
  const [selectedPeriod, setSelectedPeriod] = useState(initialData.period);
  const [selectedDate, setSelectedDate] = useState(initialData.nextdeliverydate || "");
  const isSaveDisabled = !selectedPeriod || !selectedDate;

  const onDelete = async () => {
    try {
      await updateSubscriptionPlan(orderId, { period: "", date: "" });
      alert("변경 사항이 성공적으로 저장되었습니다.");
      router.push("/mypage/subscription");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleSave = async () => {
    try {
      await updateSubscriptionPlan(orderId, { period: selectedPeriod, date: selectedDate });
      alert("변경 사항이 성공적으로 저장되었습니다.");
      router.push("/mypage/subscription");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="w-full min-w-[360px]">
      <div className="pt-[70px] pb-[70px] px-[20px] max-w-[1280px] mx-auto lg:px-0">
        <NavigationSection />

        <HeaderSection />

        <div className="flex flex-col lg:flex-row lg:justify-center pt-[35px] gap-[35px] items-center lg:items-start">
          <div className="w-full lg:w-auto">
            <DetailSub
              title={product.name}
              image={
                product.image?.path ? (
                  <ProductImage src={product.image.path} alt={product.name} />
                ) : (
                  <Product404 />
                )
              }
              price={`${product.price.toLocaleString()} 원`}
            />
          </div>

          <div className="flex flex-col gap-[28px] w-full lg:w-[486px]">
            <DeliveryPeri currentPeriod={selectedPeriod} onChange={setSelectedPeriod} />
            <Adjustdelivery value={selectedDate} onChange={setSelectedDate} />

            <ActionButtons onSave={handleSave} disabled={isSaveDisabled} />
            <DeleteButtons onDelete={onDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}

const NavigationSection = () => (
  <Link className="flex flex-row gap-[7px] mb-[35px]" href={"/mypage/subscription"}>
    <PrevIcon className="w-[17.5px] h-[17.5px] text-[#909094]" />
    <p className="text-[#909094] font-inter text-[11.7px] font-black uppercase">내 계정으로</p>
  </Link>
);

const HeaderSection = () => (
  <div className="flex flex-col items-center gap-[14px]">
    <Badge variant="accent">MANAGE PLAN</Badge>
    <h1 className="text-[#1A1A1C] text-center font-inter text-[39.5px] font-black">
      정기 구독 플랜
    </h1>
    <p className="text-[#646468] text-center font-inter text-[14.7px] font-medium">
      아이의 식사량에 맞춰 배송 주기와 일정을 자유롭게 조절하세요.
    </p>
  </div>
);

const ProductImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-[211px] h-[211px] rounded-3xl overflow-hidden">
    <Image src={src} alt={alt} width={211} height={211} className="object-cover" />
  </div>
);

const DeleteButtons = ({ onDelete }: { onDelete: () => void }) => (
  <div>
    <Button
      onClick={onDelete}
      className="rounded-[28px] border-2 border-black/[0.06] w-full"
      size="md"
      variant="ghost"
    >
      구독 해지 신청
    </Button>
  </div>
);

const ActionButtons = ({ onSave, disabled }: { onSave: () => void; disabled: boolean }) => (
  <div className="flex flex-col gap-[12px]">
    <Button
      size="md"
      variant="primary"
      className={`w-full ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onSave}
      disabled={disabled}
    >
      변경 사항 저장하기
    </Button>
  </div>
);
