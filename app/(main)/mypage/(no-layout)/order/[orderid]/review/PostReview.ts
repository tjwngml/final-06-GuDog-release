"use server";

import { ReviewExtra } from "@/types";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "06-final";

export async function uploadFile(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("이미지 업로드 실패");
  const data = await res.json();
  return data.file || data.item?.[0] || data;
}

export async function createReview(reviewData: {
  order_id: number;
  product_id: number;
  rating: number;
  content: string;
  extra?: ReviewExtra;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_URL}/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: reviewData.order_id,
      product_id: reviewData.product_id,
      rating: reviewData.rating,
      content: reviewData.content,
      extra: reviewData.extra,
    }),
  });

  if (!res.ok) throw new Error("리뷰 등록 실패");
  return res.json();
}
