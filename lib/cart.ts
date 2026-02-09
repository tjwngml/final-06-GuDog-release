import { CartItemRes, CartListRes, ResData } from "@/types/response";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

/**
 * 장바구니 목록 조회
 * @param {string} accessToken - 인증 토큰
 * @returns {Promise<ResData<CartListRes>>} - 장바구니 목록 응답 객체
 * @example
 * // 장바구니 조회
 * getCartItems(token);
 */
export async function getCartItems(accessToken: string): Promise<ResData<CartListRes>> {
  try {
    const headers: HeadersInit = {
      "Client-Id": CLIENT_ID,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${API_URL}/carts`, { headers });

    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 조회에 실패했습니다." };
  }
}

/**
 * 장바구니에 상품 추가
 */
export async function addToCart(
  token: string,
  productId: number,
  quantity: number,
  purchaseType: "oneTime" | "subscription",
  deliveryCycle?: "2w" | "4w",
): Promise<ResData<CartItemRes>> {
  try {
    const res = await fetch(`${API_URL}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity,
        color: purchaseType, // "oneTime" | "subscribe" 구매 타입
        ...(deliveryCycle ? { size: deliveryCycle } : {}),
      }), // true면 2w or 4w를 {size: "2w"} 스프레드 펼쳐서 조건부 추가, undefined는 1회 구매
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "장바구니 추가에 실패했습니다." };
  }
}
