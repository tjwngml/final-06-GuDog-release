import { ErrorRes, OrderListRes } from "@/types/response";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface GetOrdersOptions {
  user_id?: number;
  state?: string;
  custom?: Record<string, unknown>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

/**
 * 주문 목록 조회
 * @param {GetOrdersOptions} options - 조회 옵션
 * @param {number} [options.user_id] - 주문한 회원 id
 * @param {string} [options.state] - 주문 상태 (예: OS020)
 * @param {Record<string, unknown>} [options.custom] - custom 검색 조건 (MongoDB 쿼리)
 * @param {number} [options.page] - 페이지 번호
 * @param {number} [options.limit] - 한 페이지당 항목 수
 * @param {Record<string, 1 | -1>} [options.sort] - 정렬 조건 (기본값: { createdAt: -1 })
 * @returns {Promise<OrderListRes | ErrorRes>} - 주문 목록 응답 객체
 * @example
 * // 전체 조회
 * getOrders();
 *
 * // 특정 회원 주문 조회
 * getOrders({ user_id: 4 });
 *
 * // 특정 기간 주문 조회
 * getOrders({ custom: { createdAt: { $gte: "2024.04", $lt: "2024.05" } } });
 */
export async function getOrders(
  token: string, // 토큰값 필수
  options?: GetOrdersOptions,
): Promise<OrderListRes | ErrorRes> {
  try {
    const params = new URLSearchParams();

    if (options) {
      const { user_id, state, custom, page, limit, sort } = options;

      if (user_id) params.append("user_id", String(user_id));
      if (state) params.append("state", state);
      if (custom) params.append("custom", JSON.stringify(custom));
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));
      if (sort) params.append("sort", JSON.stringify(sort));
    }

    const queryString = params.toString();
    const url = queryString
      ? `${API_URL}/seller/orders?${queryString}`
      : `${API_URL}/seller/orders`;

    const headers: HeadersInit = {
      "Client-Id": CLIENT_ID,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });

    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 주문 목록 조회에 실패했습니다." };
  }
}
