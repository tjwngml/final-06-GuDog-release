"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Tab from "@/components/common/Tab";

type PurchaseType = "oneTime" | "subscribe";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("oneTime");
  const [deliveryCycle, setDeliveryCycle] = useState<"2w" | "4w">("2w");

  const basePrice = 32000;
  const discountRate = 0.1;
  const finalPrice = purchaseType === "subscribe" ? basePrice * (1 - discountRate) : basePrice;

  const purchaseTabs: { key: PurchaseType; label: string }[] = [
    { key: "oneTime", label: "1회 구매" },
    { key: "subscribe", label: "정기구독" },
  ];

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-500 flex items-end justify-center bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-[73rem] rounded-t-4xl bg-white px-20 py-10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 막대 */}
        <div className="flex justify-center pb-7 cursor-pointer" onClick={onClose}>
          <span className="h-1.5 w-15 rounded-full bg-gray-200" />
        </div>

        {/* 배송 옵션 */}
        <div className="flex w-full justify-between">
          <Tab
            tabs={purchaseTabs}
            activeTab={purchaseType}
            onTabChange={setPurchaseType}
            className="w-full"
          />
        </div>

        {/* 상품 정보 */}
        <div className="flex items-stretch gap-6 mt-10">
          <Image
            src="/images/product-404.jpg"
            alt="상품 이미지"
            width={130}
            height={130}
            className="rounded-3xl"
          />
          <div className="flex flex-col h-full justify-center items-start gap-2">
            {purchaseType !== "subscribe" && (
              <span className="inline-block rounded-lg bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600">
                일회성구매
              </span>
            )}
            <p className="text-center font-bold text-2xl">어덜트 밸런스 치킨</p>
            <div className="flex items-center gap-2">
              {purchaseType === "subscribe" && (
                <span className="text-sm text-gray-400 line-through">
                  {basePrice.toLocaleString()}원
                </span>
              )}
              <p className="font-bold text-xl text-[#fba613]">{finalPrice.toLocaleString()}원</p>
            </div>
          </div>

          <button
            type="button"
            className="ml-auto self-start text-l text-[#646468]"
            onClick={onClose}
          >
            X
          </button>
        </div>

        {/* 1회 구매 */}
        {purchaseType !== "subscribe" && (
          <div className="flex flex-col gap-15 mt-10">
            <div className="rounded-full border border-black/10 bg-gray-50 px-6 py-5.5 text-center">
              <span className="flex justify-center text-l font-semibold text-[#646468]">
                현재 &nbsp; <span className="font-bold text-black">1회성 일반 구매</span>를
                선택하셨습니다.
              </span>
            </div>
            <div className="h-px bg-gray-200" />
          </div>
        )}

        {/* 정기구독 */}
        {purchaseType === "subscribe" && (
          <div className="flex flex-col gap-6 mt-10">
            <span className="font-semibold text-m">배송주기 선택</span>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                variant={deliveryCycle === "2w" ? "secondary" : "outline"}
                onClick={() => setDeliveryCycle("2w")}
                className="flex-1 w-[35rem]"
              >
                격주 배송(2주)
              </Button>
              <Button
                variant={deliveryCycle === "4w" ? "secondary" : "outline"}
                onClick={() => setDeliveryCycle("4w")}
                className="flex-1 w-[35rem]"
              >
                매월 배송(4주)
              </Button>
            </div>
            <span className="text-[#fba613] font-semibold text-sm">
              * 정기구독 시 10% 추가 할인 혜택이 적용됩니다.
            </span>
            <div className="h-px bg-gray-200" />
          </div>
        )}

        {/* 수량 */}
        <div className="flex justify-between mt-10">
          <p className="font-semibold text-m">수량</p>
          <button type="button">- 1 +</button>
        </div>

        <div className="h-px bg-gray-200 mt-10" />

        {/* 총 결제금액 */}
        <div className="flex justify-between mt-10">
          <div className="flex justify-center items-center gap-3">
            <p className="font-semibold text-xl">총 결제금액</p>
            {purchaseType === "subscribe" && (
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                10% 할인
              </span>
            )}
            {purchaseType !== "subscribe" && (
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                무료배송
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {purchaseType === "subscribe" && (
              <span className="text-2xl text-gray-400 line-through">
                {basePrice.toLocaleString()}원
              </span>
            )}
            <p className="font-bold text-2xl text-[#fba613]">{finalPrice.toLocaleString()}원</p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex flex-col sm:flex-row sm:gap-4">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => router.push("/cart")}
            className="flex-1 w-[35rem] border border-black rounded bg-white py-2"
          >
            장바구니 담기
          </Button>
          <Button
            type="button"
            size="lg"
            variant="primary"
            onClick={() => router.push("/checkout")}
            className="flex-1 w-[35rem] rounded py-2"
          >
            바로 구매하기
          </Button>
        </div>
      </div>
    </div>
  );
}
