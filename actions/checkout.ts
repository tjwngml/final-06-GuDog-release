"use server";

import { ErrorRes, Order } from "@/types";

// 요청 시 보낼 상품 데이터 타입
export interface OrderRequestProduct {
  _id: number;
  quantity: number;
  size?: string;
  color?: string;
}

// 주문 성공 시 전체 응답 구조 정의
interface OrderSuccessRes {
  ok: 1;
  item: Order;
}

/**
 * 주문 생성 API 호출 (POST /orders)
 */
export async function createOrder(
  products: OrderRequestProduct[],
  accessToken: string
): Promise<OrderSuccessRes | ErrorRes> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ products }),
    });

    const data = (await response.json()) as OrderSuccessRes | ErrorRes;

    if (response.ok && data.ok === 1) {
      return data; // result.item = Order 타입
    } else {
      return data as ErrorRes;
    }
  } catch (error) {
    console.error("Order Action Error:", error);
    return { ok: 0, message: "일시적인 네트워크 문제로 주문에 실패했습니다." };
  }
}
