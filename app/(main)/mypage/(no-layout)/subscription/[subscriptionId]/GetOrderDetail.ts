import { cookies } from "next/headers";
import { OrderDetailRes } from "@/types/mypage-order";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";
/**
 * 주문 상세 정보 조회 함수
 * @param _id 주문 ID
 */
export async function getOrderDetail(_id: string): Promise<OrderDetailRes | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${_id}`;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "client-id": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`주문 상세 조회 실패: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("getOrderDetail Error:", error);
    return null;
  }
}
