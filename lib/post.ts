import { ErrorRes, PostListRes } from "@/types/response";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface GetPostsOptions {
  boardType: string;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  page?: number;
  keyword?: string;
  custom?: Record<string, unknown>;
}

/**
 * 게시판 타입에 해당하는 게시글 목록 조회
 * @param {GetPostsOptions} options - 조회 옵션
 * @param {string} options.boardType - 게시판 타입(예: notice, qna, free 등)
 * @param {number} [options.limit] - 한 페이지당 항목 수
 * @param {number} [options.page] - 페이지 번호
 * @param {string} [options.keyword] - 검색어 (제목, 내용, 태그 검색)
 * @param {Record<string, unknown>} [options.custom] - custom 검색 조건 (MongoDB 쿼리)
 * @param {Record<string, 1 | -1>} [options.sort] - 정렬 조건 (예: { views: -1 }, { createdAt: 1 })
 * @returns {Promise<PostListRes | ErrorRes>} - 게시글 목록 응답 객체
 * @example
 * // 기본 조회
 * getPosts({ boardType: "qna" });
 *
 * // 조회수 많은 순 3개
 * getPosts({ boardType: "qna", sort: { views: -1 }, limit: 3 });
 */
export async function getPosts(options: GetPostsOptions): Promise<PostListRes | ErrorRes> {
  try {
    const { boardType, limit, sort, page, keyword, custom } = options;

    const params = new URLSearchParams();
    params.append("type", boardType);

    if (limit) params.append("limit", String(limit));
    if (page) params.append("page", String(page));
    if (keyword) params.append("keyword", keyword);
    if (sort) params.append("sort", JSON.stringify(sort));
    if (custom) params.append("custom", JSON.stringify(custom));

    console.log(params.toString());

    const res = await fetch(`${API_URL}/posts?${params.toString()}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      next: {
        tags: [`posts?type=${boardType}`],
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 게시물 목록 조회에 실패했습니다." };
  }
}
