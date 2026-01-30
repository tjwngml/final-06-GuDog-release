import Checkbox from "@/components/common/Checkbox";
import ProductImage from "@/components/common/ProductImage";
import QuantityControl from "@/components/common/Quantitycontrol";
import Image from "next/image";

export default function OnetimeItemList() {
  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2 sm:gap-5 border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
        <Checkbox label="프라임 어덜트" hideLabel />
        <div className="w-20 h-20 sm:w-24 shrink-0">
          <ProductImage src="" alt="" className="rounded-[0.875rem]" />
        </div>
        <div className="flex flex-col gap-1 sm:gap-3.5">
          <h3 className="text-[#1A1A1C] text-sm sm:text-[1rem] font-black">프라임 어덜트 사료</h3>
          <p className="text-text-tertiary text-[0.75rem] font-bold">5kg</p>
          <QuantityControl />
        </div>
        <div className="flex flex-col items-end ml-auto gap-8 sm:gap-14">
          <button>
            <Image src="/images/cart/x.svg" alt="" width={28} height={28} />
          </button>
          <p className="text-[#1A1A1C] font-black text-sm sm:text-[1rem]">34,000원</p>
        </div>
      </div>
    </section>
  );
}
