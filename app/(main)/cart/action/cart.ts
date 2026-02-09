"use server";
import { getCartItems as apiGetCartItems } from "@/lib/cart";
import { CartItemRes, CartListRes, ErrorRes } from "@/types/response";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";
// const TEMP_TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjMsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzcwMDg0MDE0LCJleHAiOjE3NzAxNzA0MTQsImlzcyI6IkZFQkMifQ.wYaIJ3zoIJrF1CPf1P_vgYDRPPQWHn3XfdgKXpF97G0";

type ActionState = ErrorRes | null;

/**
 * 장바구니 목록 조회
 */

export async function getCartItems(accessToken: string): Promise<CartListRes | ErrorRes> {
  return apiGetCartItems(accessToken);
}

/**
 * 장바구니 수량 수정
 */

export async function updateCartItem(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const accessToken = formData.get("accessToken") as string;

  const cartId = formData.get("cartId");

  const body = {
    quantity: Number(formData.get("quantity")),
  };

  let res: Response;
  let data: CartItemRes | ErrorRes;

  try {
    res = await fetch(`${API_URL}/carts/${cartId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 수정에 실패했습니다." };
  }

  if (data.ok) {
    revalidatePath("/cart"); // 장바구니 페이지 갱신
    return null; // 성공
  } else {
    return data; // 에러 응답 객체 반환
  }
}

/**
 * 장바구니 상품 한건 삭제
 */
export async function deleteCartItem(
  cartId: number,
  accessToken: string
): Promise<ErrorRes | null> {
  let res: Response;
  let data: CartItemRes | ErrorRes;

  try {
    res = await fetch(`${API_URL}/carts/${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 삭제에 실패했습니다." };
  }

  if (data.ok) {
    revalidatePath("/cart");
    return null;
  } else {
    return data;
  }
}

/**
 * 장바구니 상품 여러 건 삭제
 */

export async function deleteCartItems(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const CartIdString = formData.get("cartIds");
  const cartIds = CartIdString ? JSON.parse(CartIdString as string) : [];
  const accessToken = formData.get("accessToken") as string;

  const body = {
    carts: cartIds,
  };

  let res: Response;
  let data: CartItemRes | ErrorRes;

  try {
    res = await fetch(`${API_URL}/carts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 삭제에 실패했습니다." };
  }

  if (data.ok) {
    revalidatePath("/cart");
    return null;
  } else {
    return data;
  }
}
