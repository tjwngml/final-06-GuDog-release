import SubscriptionItemList from "@/app/(main)/cart/_components/subscription-item-list";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Image from "next/image";

export default function SubscriptionCart() {
  return (
    <div className="flex flex-col xl:flex-row gap-9 justify-center">
      {/* 장바구니 목록 */}
      <div className="xl:w-2/3">
        <section className="flex gap-3 items-center bg-white border border-[#F9F9FB] rounded-[0.875rem] p-3 sm:p-7 mb-5 shadow-(--shadow-card)">
          <Checkbox label="전체 선택(2/2)" className="text-[#1A1A1C] text-[0.75rem] font-black" />
          <button className="ml-auto text-text-tertiary text-[0.625rem] font-bold">
            선택 삭제
          </button>
        </section>

        {/* 상품 목록 */}
        <SubscriptionItemList />
      </div>

      {/* 결제 상세 요약 */}
      <aside className="xl:w-1/3">
        <div className="xl:sticky xl:top-8">
          <section className="flex flex-col gap-7 bg-white border border-border-primary rounded-[0.875rem] shadow-(--shadow-card) px-9 py-9 mb-5">
            <h2 className="text-[1.125rem] text-[#1A1A1C] font-black">결제 상세 요약</h2>
            <div className="flex justify-between">
              <p className="text-[0.75rem] text-text-secondary font-bold">총 상품 금액</p>
              <p className="text-[0.75rem] text-[#1A1A1C] font-black">59,000원</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[0.75rem] text-text-secondary font-bold">배송비</p>
              <p className="text-[0.75rem] text-[#1A1A1C] font-black">+0원</p>
            </div>

            <div className="flex justify-between border-t border-border-primary py-7">
              <h2 className="text-[1rem] text-[#1A1A1C] font-black">총 결제 예정액</h2>
              <p className="text-2xl text-[#FBA613] font-black">59,000원</p>
            </div>

            {/* 구매하기 버튼 */}
            <Button>2개 상품 구매하기</Button>

            <div className="flex items-center justify-center gap-2">
              <Image src="/images/cart/safe.svg" alt="" width={14} height={14} />
              <p className="text-center text-[0.75rem] text-text-tertiary font-black">
                안전한 보안 결제 시스템
              </p>
            </div>
          </section>

          {/* 정기 구독 혜택 */}
          <section className="flex flex-col bg-[#FFF9F2] px-5 py-5 rounded-[0.875rem] gap-3 border border-[#FFF5E6]">
            <div className="flex items-center gap-2.5">
              <Image src="/images/cart/구독혜택.svg" alt="" width={28} height={28} />
              <h3 className="text-[0.75rem] text-[#1A1A1C] font-black">나만의 정기 구독 혜택</h3>
            </div>
            <ul className="flex flex-col gap-1.5 ml-4">
              <li className="text-[0.75rem] text-text-tertiary font-bold list-disc ml-2 pl-1">
                배송비 무료 혜택
              </li>
              <li className="text-[0.75rem] text-text-tertiary font-bold list-disc ml-2 pl-1">
                전 상품 10% 자동 상시 할인
              </li>
              <li className="text-[0.75rem] text-text-tertiary font-bold list-disc ml-2 pl-1">
                배송 주기 자유로운 변경 및 해지
              </li>
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}
