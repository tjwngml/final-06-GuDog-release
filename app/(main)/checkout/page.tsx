"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import ProductImage from "@/components/common/ProductImage";
import Image from "next/image";

function CheckoutContent() {
  const searchParams = useSearchParams();

  const productName = searchParams.get("name") || "";
  const productImage = searchParams.get("image") || "";
  const price = Number(searchParams.get("price")) || 0;
  const quantity = Number(searchParams.get("quantity")) || 1;
  const purchaseType = searchParams.get("type") || "oneTime";
  const deliveryCycle = searchParams.get("cycle") || "";

  const isSubscribe = purchaseType === "subscribe";
  const discountRate = isSubscribe ? 0.1 : 0;
  const totalProductPrice = price * quantity;
  const discountAmount = Math.floor(totalProductPrice * discountRate);
  const finalPrice = totalProductPrice - discountAmount;

  const cycleLabel =
    deliveryCycle === "2w" ? "2주 주기" : deliveryCycle === "4w" ? "4주 주기" : "";

  return (
    <div className="bg-(--color-bg-secondary)">
      <div className="xl:max-w-300 min-w-90 mx-auto px-4 pt-8 pb-[8.75em]">
        {/* 헤더 */}
        <section className="text-center mb-16 mt-10">
          <Badge variant="accent" className="mb-3.5">
            CHECKOUT
          </Badge>
          <h2 className="text-[2rem] font-black">주문/결제</h2>
        </section>
        <div className="flex flex-col xl:flex-row gap-10">
          <div className="flex flex-col gap-9 xl:w-2/3">
            {/* 주문 상품 정보 */}
            <section>
              <div className="border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
                <h2 className="text-lg text-(--color-text-primary) font-black mb-7">
                  주문 상품 정보
                </h2>
                <div className="flex gap-2 sm:gap-5">
                  <div className="w-20 h-20 sm:w-17 shrink-0">
                    <ProductImage
                      src={productImage}
                      alt={productName}
                      className="w-full h-full rounded-[0.875rem] object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 sm:gap-1 mt-2.5">
                    <p className="text-[1rem] text-(--color-text-primary) font-black">
                      {productName}
                    </p>
                    <p className="text-xs text-(--color-text-tertiary) font-bold">
                      {isSubscribe
                        ? `정기배송 (${cycleLabel}) | 수량 ${quantity}개`
                        : `수량 ${quantity}개`}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 배송 정보 */}
            <section>
              <div className="border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
                <h2 className="text-lg text-(--color-text-primary) font-black mb-7">배송 정보</h2>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-5">
                    <Input label="수령인" placeholder="" className="w-full" />
                    <Input label="연락처" placeholder="" className="w-full" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex gap-2.5 items-end">
                      <Input label="배송지 주소" placeholder="" />
                      <Button variant="outline" size="md" className="">
                        주소 찾기
                      </Button>
                    </div>
                    <Input label="" placeholder="" />
                    <Input label="" placeholder="상세 주소를 입력해주세요" />
                  </div>
                  <Input label="배송 요청사항" placeholder="" />
                </div>
              </div>
            </section>

            {/* 결제 수단 선택
            <section>
              <div className="flex flex-col gap-7 border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
                <h2 className="text-lg text-(--color-text-primary) font-black">결제 수단 선택</h2>
                <div className="flex flex-1 gap-3.5">
                  <button className="flex flex-col gap-2 items-center bg-accent-soft border-2 border-(--color-accent-primary) rounded-[0.875rem] px-10 py-5 text-xs text-accent-primary font-black w-full">
                    <Image
                      src="/images/checkout/신용카드.svg"
                      alt=""
                      width={29}
                      height={28}
                      className="flex justify-center"
                    />
                    신용/체크카드
                  </button>
                </div>
              </div>
            </section> */}
          </div>

          {/* 최종 결제 금액 */}
          <div className="xl:w-1/3">
            <div className="xl:sticy xl:top-8">
              <section>
                <div className="flex flex-col gap-7 border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
                  <h2 className="text-lg text-(--color-text-primary) font-black">최종 결제 금액</h2>
                  <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between">
                      <p className="text-xs text-(--color-text-secondary) font-bold">
                        총 상품 금액
                      </p>
                      <p className="text-xs text-(--color-text-primary) font-bold">
                        {totalProductPrice.toLocaleString()}원
                      </p>
                    </div>
                    {isSubscribe && (
                      <div className="flex justify-between">
                        <p className="text-xs text-(--color-text-secondary) font-bold">
                          정기 구독 할인
                        </p>
                        <p className="text-xs text-(--color-accent-primary) font-bold">
                          -{discountAmount.toLocaleString()}원
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <p className="text-xs text-(--color-text-secondary) font-bold">배송비</p>
                      <p className="text-xs text-(--color-text-primary) font-bold">0원</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-text-tertiary pt-7">
                    <p className="text-[1rem] text-(--color-text-primary) font-black">
                      최종 결제액
                    </p>
                    <p className="text-[1.625rem] text-(--color-accent-primary) font-black">
                      {finalPrice.toLocaleString()}원
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1.5 py-1.5">
                    <li>
                      <Checkbox label="주문 정보를 확인하였으며 결제에 동의합니다." size="sm" />
                    </li>
                    {isSubscribe && (
                      <li>
                        <Checkbox label="매월 자동 정기 결제에 동의합니다." size="sm" />
                      </li>
                    )}
                    <li>
                      <Checkbox label="개인정보 제 3자 제공에 동의합니다." size="sm" />
                    </li>
                  </ul>
                  <Button>{finalPrice.toLocaleString()}원 결제하기</Button>
                  <p className="text-xs text-(--color-text-secondary) font-black text-center">
                    장바구니로 돌아가기
                  </p>
                </div>
                <p className="flex justify-center gap-2.5 text-[0.625rem] text-(--color-text-primary) font-black) mt-7">
                  <Image src="/images/checkout/safe2.svg" alt="" width={18} height={18} />
                  TSL 1.3 암호화 보안 결제 시스템
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
