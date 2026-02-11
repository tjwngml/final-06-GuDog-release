// lib/bookmark.ts
import { BookmarkInfoRes, BookmarkListRes, ResData, EmptyRes } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface GetWishlistOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export async function getWishlist(
  token: string,
  options?: GetWishlistOptions,
): Promise<ResData<BookmarkListRes>> {
  try {
    const params = new URLSearchParams();

    if (options) {
      const { page, limit, sort } = options;
      if (page !== undefined) params.append("page", String(page));
      if (limit !== undefined) params.append("limit", String(limit));
      if (sort) params.append("sort", JSON.stringify(sort));
    }

    const res = await fetch(`${API_URL}/bookmarks/product?${params.toString()}`, {
      method: "GET",
      headers: {
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getWishlist 에러:", error);
    return { ok: 0, message: "조회에 실패했습니다." };
  }
}

export async function deleteWishlist(
  token: string,
  bookmarkId: number,
): Promise<ResData<EmptyRes>> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/${bookmarkId}`, {
      method: "DELETE",
      headers: {
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (error) {
    console.error("삭제 에러:", error);
    return { ok: 0, message: "삭제 도중 오류가 발생했습니다." };
  }
}

/**
 * 북마크(관심상품) 등록
 * @param {string} token - 로그인 토큰
 * @param {number} productId - 상품 id
 * @returns {Promise<ResData<BookmarkInfoRes>>} - 북마크 등록 응답 객체
 */
export async function addBookmark(
  token: string,
  productId: number,
): Promise<ResData<BookmarkInfoRes>> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        target_id: productId,
      }),
    });
    if (res.status === 409) {
      return { ok: 0, message: "이미 등록된 관심상품입니다." };
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "관심상품 등록에 실패했습니다." };
  }
}
