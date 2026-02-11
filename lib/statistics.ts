import { ErrorRes, OrderStatisticsRes } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface GetOrderStatisticsOptions {
  by?: "seller" | "product" | "day";
  start?: string;
  finish?: string;
  custom?: Record<string, unknown>;
}

/**
 * 주문량 통계 조회
 * @param {GetOrderStatisticsOptions} options - 조회 옵션
 * @param {string} [options.by] - 그룹 기준 (seller: 판매자별, product: 상품별, day: 일별, 미지정: 전체)
 * @param {string} [options.start] - 조회 시작일 (생략시 1주일 전) 예: "2025.01.02"
 * @param {string} [options.finish] - 조회 종료일 (생략시 오늘) 예: "2025.01.11"
 * @param {Record<string, unknown>} [options.custom] - custom 검색 조건 (MongoDB 쿼리)
 * @returns {Promise<ResData<OrderStatisticsRes>>} - 주문량 통계 응답 객체
 * @example
 * // 전체 주문량 조회
 * getOrderStatistics();
 *
 * // 판매자별 주문량 조회
 * getOrderStatistics({ by: "seller" });
 *
 * // 일별 주문량 조회 (특정 기간)
 * getOrderStatistics({ by: "day", start: "2025.01.01", finish: "2025.01.31" });
 *
 * // 4만원 이상 주문만 조회
 * getOrderStatistics({ custom: { "cost.total": { $gte: 40000 } } });
 */
export async function getOrderStatistics(
  token: string, // 토큰값 필수
  options?: GetOrderStatisticsOptions,
): Promise<OrderStatisticsRes | ErrorRes> {
  try {
    const params = new URLSearchParams();

    if (options) {
      const { by, start, finish, custom } = options;

      if (by) params.append("by", by);
      if (start) params.append("start", start);
      if (finish) params.append("finish", finish);
      if (custom) params.append("custom", JSON.stringify(custom));
    }

    const queryString = params.toString();
    const url = queryString
      ? `${API_URL}/admin/statistics/orders?${queryString}`
      : `${API_URL}/admin/statistics/orders`;

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
    return { ok: 0, message: "일시적인 네트워크 문제로 주문 통계 조회에 실패했습니다." };
  }
}
