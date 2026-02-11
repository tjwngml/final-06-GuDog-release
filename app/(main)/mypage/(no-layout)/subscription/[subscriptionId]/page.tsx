import SubscriptionEditClient from "@/app/(main)/mypage/(no-layout)/subscription/[subscriptionId]/SubscriptionEditClient";
import { getOrderDetail } from "./GetOrderDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "구독 관리",
  description: "9DOG 구독 상세 정보 및 관리 페이지입니다.",
};

interface Props {
  params: { subscriptionId: string };
}

export default async function SubscriptionEditPage({ params }: Props) {
  const { subscriptionId } = await params;
  const response = await getOrderDetail(subscriptionId);

  if (!response || response.ok !== 1) {
    return <div className="py-40 text-center text-[#909094]">주문 내역을 불러올 수 없습니다.</div>;
  }

  return <SubscriptionEditClient initialData={response.item} orderId={subscriptionId} />;
}
