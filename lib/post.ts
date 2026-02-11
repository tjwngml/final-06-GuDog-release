import { PostInfoRes, PostListRes, ReplyListRes, ResData } from "@/types";

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

interface GetRepliesOptions {
  _id: string | number;
  limit?: number;
  page?: number;
  keyword?: string;
  type?: string;
  custom?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
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
 * @returns {Promise<ResData<PostListRes>>} - 게시글 목록 응답 객체
 * @example
 * // 기본 조회
 * getPosts({ boardType: "qna" });
 *
 * // 조회수 많은 순 3개
 * getPosts({ boardType: "qna", sort: { views: -1 }, limit: 3 });
 */
export async function getPosts(options: GetPostsOptions): Promise<ResData<PostListRes>> {
  try {
    const { boardType, limit, sort, page, keyword, custom } = options;

    const params = new URLSearchParams();
    params.append("type", boardType);

    if (limit) params.append("limit", String(limit));
    if (page) params.append("page", String(page));
    if (keyword) params.append("keyword", keyword);
    if (sort) params.append("sort", JSON.stringify(sort));
    if (custom) params.append("custom", JSON.stringify(custom));

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

/**
 * 게시글 상세 조회
 * @param {string | number} _id - 게시글 id
 * @returns {Promise<ResData<PostInfoRes>>} - 게시글 상세 응답 객체
 * @example
 * // 게시글 상세 조회
 * getPost(1);
 * getPost("1");
 */
export async function getPost(_id: string | number): Promise<ResData<PostInfoRes>> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      next: {
        tags: [`post-${_id}`],
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 게시글 조회에 실패했습니다." };
  }
}

/**
 * 게시글의 댓글 목록 조회
 * @param {GetRepliesOptions} options - 조회 옵션
 * @param {string | number} options._id - 게시글 id
 * @param {number} [options.limit] - 한 페이지당 항목 수
 * @param {number} [options.page] - 페이지 번호
 * @param {string} [options.keyword] - 검색어
 * @param {string} [options.type] - 타입
 * @param {Record<string, unknown>} [options.custom] - custom 검색 조건 (MongoDB 쿼리)
 * @param {Record<string, 1 | -1>} [options.sort] - 정렬 조건 (기본값: { _id: 1 })
 * @returns {Promise<ResData<ReplyListRes>>} - 댓글 목록 응답 객체
 * @example
 * // 기본 조회
 * getReplies({ _id: 1 });
 *
 * // 최신순 정렬, 페이지네이션
 * getReplies({ _id: 1, sort: { createdAt: -1 }, page: 1, limit: 10 });
 */
export async function getReplies(options: GetRepliesOptions): Promise<ResData<ReplyListRes>> {
  try {
    const { _id, limit, sort, page, keyword, type, custom } = options;

    const params = new URLSearchParams();

    if (limit) params.append("limit", String(limit));
    if (page) params.append("page", String(page));
    if (keyword) params.append("keyword", keyword);
    if (type) params.append("type", type);
    if (sort) params.append("sort", JSON.stringify(sort));
    if (custom) params.append("custom", JSON.stringify(custom));

    const queryString = params.toString();
    const url = queryString
      ? `${API_URL}/posts/${_id}/replies?${queryString}`
      : `${API_URL}/posts/${_id}/replies`;

    const res = await fetch(url, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
      next: {
        tags: [`replies-${_id}`],
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 댓글 목록 조회에 실패했습니다." };
  }
}
