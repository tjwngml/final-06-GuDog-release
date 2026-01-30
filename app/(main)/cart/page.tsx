"use client";

import OnetimeCart from "@/app/(main)/cart/cart";
import SubscriptionCart from "@/app/(main)/cart/subscription-cart";
import Badge from "@/components/common/Badge";
import Tab from "@/components/common/Tab";
import { useState } from "react";

type TabType = "oneTime" | "subscription";

export default function Cart() {
  const [activeTab, setActiveTab] = useState<TabType>("oneTime");

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "oneTime", label: "1회 구매", count: 2 },
    { key: "subscription", label: "정기구독", count: 1 },
  ];

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
