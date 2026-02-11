import { API_URL, CLIENT_ID } from "./config";
import { ResData, ReviewListRes } from "@/types";

interface GetAllRepliesOptions {
  rating?: string;
  full_name?: boolean;
  sort?: Record<string, 1 | -1>;
  page?: number;
  limit?: number;
  revalidate?: number;
}

/**
 * 모든 상품 구매 후기 목록 조회
 * @param {GetAllRepliesOptions} options - 조회 옵션
 * @param {string} [options.rating] - 별점 필터
 * @param {boolean} [options.full_name] - 회원 이름 전체 표시 여부 (true: 전체 표시, 미입력 시 마스킹 처리)
 * @param {Record<string, 1 | -1>} [options.sort] - 정렬 조건 (예: { rating: -1 })
 * @param {number} [options.page] - 페이지 번호
 * @param {number} [options.limit] - 한 페이지당 항목 수
 * @param {number} [options.revalidate] - 캐쉬 지속시간
 * @returns {Promise<ResData<ReplyListRes>>} - 구매 후기 목록 응답 객체
 * @example
 * // 기본 조회
 * getAllReplies();
 *
 * // 별점 높은 순 정렬
 * getAllReplies({ sort: { rating: -1 } });
 *
 * // 페이지네이션 적용
 * getAllReplies({ page: 1, limit: 10 });
 *
 * // 이름 전체 표시 + 별점 필터
 * getAllReplies({ rating: "5", full_name: true });
 */
export async function getAllReplies(
  options: GetAllRepliesOptions = {},
): Promise<ResData<ReviewListRes>> {
  try {
    const { rating, full_name, sort, page, limit, revalidate } = options;

    const params = new URLSearchParams();

    if (rating) params.append("rating", rating);
    if (full_name !== undefined) params.append("full_name", String(full_name));
    if (sort) params.append("sort", JSON.stringify(sort));
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    const res = await fetch(`${API_URL}/replies/all?${params.toString()}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      next: {
        tags: ["replies-all"],
      },
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: "일시적인 네트워크 문제로 구매 후기 목록 조회에 실패했습니다.",
    };
  }
}

// 후기 평균 평점 함수
export async function getReviewStats(): Promise<{ average: number; total: number }> {
  try {
    const res = await fetch(`${API_URL}/replies/all?limit=9999`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
    });

    const data = await res.json();

    if (!data.ok || !data.item?.length) {
      return { average: 0, total: 0 };
    }

    const reviews = data.item;
    const total = reviews.length;
    const average =
      Math.round(
        (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / total) * 10,
      ) / 10;

    return { average, total };
  } catch {
    return { average: 0, total: 0 }; // 에러 시 기본값
  }
}
