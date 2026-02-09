"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Tab from "@/components/common/Tab";
import QuantityControl from "@/components/common/Quantitycontrol";
import { Product } from "@/types/product";
import { addToCart } from "@/lib/cart";
import useUserStore from "@/zustand/useStore";

type PurchaseType = "oneTime" | "subscription";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function PurchaseModal({ isOpen, onClose, product }: Props) {
  const router = useRouter();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("oneTime");
  const [deliveryCycle, setDeliveryCycle] = useState<"2w" | "4w">("2w");
  const [quantity, setQuantity] = useState(1);

  const user = useUserStore((state) => state.user);
  const incrementCart = useUserStore((state) => state.incrementCart);

  const basePrice = product.price;
  const discountRate = 0.1;
  const unitPrice = purchaseType === "subscription" ? basePrice * (1 - discountRate) : basePrice;
  const totalPrice = unitPrice * quantity;

  const purchaseTabs: { key: PurchaseType; label: string }[] = [
    { key: "oneTime", label: "1회구매" },
    { key: "subscription", label: "정기구독" },
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

  const handleAddToCart = async () => {
    if (!user?.token?.accessToken) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
      return;
    }

    const res = await addToCart(
      user.token.accessToken,
      product._id,
      quantity,
      purchaseType,
      purchaseType === "subscription" ? deliveryCycle : undefined,
    );

    if (res.ok === 1) {
      incrementCart(1);
      const goToCart = confirm("장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?");
      if (goToCart) {
        onClose();
        router.push(purchaseType === "subscription" ? "/cart?tab=subscription" : "/cart");
      }
    } else {
      alert("장바구니 담기에 실패했습니다.");
    }
  };

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
            src={product.mainImages[0]?.path || "/images/product-404.jpg"}
            alt={product.name}
            width={130}
            height={130}
            className="rounded-3xl"
          />
          <div className="flex flex-col h-full justify-center items-start gap-2">
            {purchaseType !== "subscription" && (
              <span className="inline-block rounded-lg bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600">
                일회성구매
              </span>
            )}
            <p className="text-center font-bold text-2xl">{product.name}</p>
            <p className="font-bold text-xl text-[#fba613]">{basePrice.toLocaleString()}원</p>
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
        {purchaseType !== "subscription" && (
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
        {purchaseType === "subscription" && (
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
          <QuantityControl onChange={setQuantity} />
        </div>

        <div className="h-px bg-gray-200 mt-10" />

        {/* 총 결제금액 */}
        <div className="flex justify-between mt-10">
          <div className="flex justify-center items-center gap-3">
            <p className="font-semibold text-xl">총 결제금액</p>
            {purchaseType === "subscription" && (
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                10% 할인
              </span>
            )}
            {purchaseType !== "subscription" && (
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                무료배송
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {purchaseType === "subscription" && (
              <span className="text-2xl text-gray-400 line-through">
                {(basePrice * quantity).toLocaleString()}원
              </span>
            )}
            <p className="font-bold text-2xl text-[#fba613]">{totalPrice.toLocaleString()}원</p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex flex-col sm:flex-row sm:gap-4">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={handleAddToCart}
            className="flex-1 w-[35rem] border border-black rounded bg-white py-2"
          >
            장바구니 담기
          </Button>
          <Button
            type="button"
            size="lg"
            variant="primary"
            onClick={() => {
              if (!user?.token?.accessToken) {
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push("/login");
                return;
              }
              const params = new URLSearchParams({
                product_id: String(product._id),
                name: product.name,
                image: product.mainImages[0]?.path || "",
                price: String(basePrice),
                quantity: String(quantity),
                type: purchaseType,
              });
              if (purchaseType === "subscription") {
                params.set("cycle", deliveryCycle);
              }
              router.push(`/checkout?${params.toString()}`);
            }}
            className="flex-1 w-[35rem] rounded py-2"
          >
            바로 구매하기
          </Button>
        </div>
      </div>
    </div>
  );
}
