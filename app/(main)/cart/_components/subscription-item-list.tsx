import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import ProductImage from "@/components/common/ProductImage";
import QuantityControl from "@/components/common/Quantitycontrol";
import Image from "next/image";

export default function SubscriptionItemList() {
  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2 sm:gap-5 border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
        <Checkbox label="프라임 어덜트" hideLabel />
        <div className="w-20 h-20 sm:w-24 shrink-0">
          <ProductImage src="" alt="" className="rounded-[0.875rem]" />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <h3 className="text-[#1A1A1C] text-sm sm:text-[1rem] font-black">프라임 어덜트 사료</h3>
          <p className="text-text-tertiary text-[0.75rem] font-bold">5kg</p>
          <p className="text-[0.625rem] text-(--color-text-primary) font-bold">배송 주기 선택</p>
          <div className="flex felx-col gap-0.5 sm:gap-1.5">
            <Button variant="outline" size="xs">
              격주 배송(2주)
            </Button>
            <Button variant="secondary" size="xs">
              미월 배송(4주)
            </Button>
          </div>
          {/* 수량 조절 버튼 */}
          <QuantityControl />
        </div>
        <div className="flex flex-col items-end ml-auto gap-18 sm:gap-32">
          <button>
            <Image src="/images/cart/x.svg" alt="" width={28} height={28} />
          </button>
          <p className="text-[#1A1A1C] font-black text-sm sm:text-[1rem]">34,000원</p>
        </div>
      </div>
    </section>
  );
}
