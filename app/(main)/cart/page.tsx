"use client";

import OnetimeCart from "@/app/(main)/cart/onetime-cart";
import SubscriptionCart from "@/app/(main)/cart/subscription-cart";
import useCartStore from "@/zustand/useCartStore";
import Badge from "@/components/common/Badge";
import Tab from "@/components/common/Tab";
import useUserStore from "@/zustand/useStore";
import { useEffect, useState } from "react";

type TabType = "oneTime" | "subscription";

export default function Cart() {
  const [activeTab, setActiveTab] = useState<TabType>("oneTime");

  // 토큰 가져오기
  const { user } = useUserStore();
  const accessToken = user?.token?.accessToken;

  // zustand 상태
  const { cartData, isLoading, error, fetchCart, getOnetimeItems, getSubscriptionItems } =
    useCartStore();

  useEffect(() => {
    if (accessToken) {
      fetchCart(accessToken);
    }
  }, [accessToken, fetchCart]);

  // 1회 구매와 정기구독 탭 카운트
  const onetimeCount = getOnetimeItems().length;
  const subscriptionCount = getSubscriptionItems().length;

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "oneTime", label: "1회구매", count: onetimeCount },
    { key: "subscription", label: "정기구독", count: subscriptionCount },
  ];

  // 로딩
  if (isLoading && !cartData) {
    return (
      <div className="bg-[#F9F9FB]">
        <div className="xl:max-w-300 min-w-90 mx-auto px-4 pt-8 pb-[8.75rem]">
          <div className="text-center py-20">
            <p className="text-text-tertiary">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="bg-[#F9F9FB]">
        <div className="xl:max-w-300 min-w-90 mx-auto px-4 pt-8 pb-[8.75rem]">
          <div className="text-center py-20">
            <p className="text-red-500">{error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9FB] ">
      <div className="xl:max-w-300 min-w-90 mx-auto px-4 pt-8 pb-[8.75rem]">
        {/* 헤더 */}
        <section className="text-center mb-16 mt-10">
          <Badge variant="accent" className="mb-3.5">
            SHOPPING CART
          </Badge>
          <h2 className="text-[2rem] font-black">장바구니</h2>
        </section>

        {/* 탭 버튼 */}
        <section className="flex justify-center mb-9">
          <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </section>
        {activeTab === "oneTime" ? <OnetimeCart /> : <SubscriptionCart />}
      </div>
    </div>
  );
}
