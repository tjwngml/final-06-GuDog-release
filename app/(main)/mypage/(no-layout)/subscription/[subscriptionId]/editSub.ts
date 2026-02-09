"use server";
import { cookies } from "next/headers";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";
export const updateSubscriptionPlan = async (
  orderId: string,
  data: { period: string; date: string },
) => {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      period: data.period,
      nextdeliverydate: data.date,
      memo: `배송 주기를 ${data.period}로 변경 요청`,
    }),
  });

  if (!res.ok) throw new Error("업데이트 실패");
  return res.json();
};
