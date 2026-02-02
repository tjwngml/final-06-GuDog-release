import { ErrorRes, UserInfoRes, UserListRes } from "@/types/response";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface GetUsersOptions {
  _id?: number;
  email?: string;
  name?: string;
  phone?: string;
  type?: "user" | "seller" | "admin";
  address?: string;
  custom?: Record<string, unknown>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

/**
 * 회원 목록 조회
 * @param {GetUsersOptions} options - 조회 옵션
 * @param {number} [options._id] - 회원 id
 * @param {string} [options.email] - 회원 이메일
 * @param {string} [options.name] - 회원 이름 (정확히 일치)
 * @param {string} [options.phone] - 회원 전화번호
 * @param {string} [options.type] - 회원 구분 (user | seller | admin)
 * @param {string} [options.address] - 회원 주소 (포함 검색)
 * @param {Record<string, unknown>} [options.custom] - custom 검색 조건 (MongoDB 쿼리)
 * @param {number} [options.page] - 페이지 번호
 * @param {number} [options.limit] - 한 페이지당 항목 수
 * @param {Record<string, 1 | -1>} [options.sort] - 정렬 조건 (기본값: { _id: -1 })
 * @returns {Promise<UserListRes | ErrorRes>} - 회원 목록 응답 객체
 * @example
 * // 전체 조회
 * getUsers();
 *
 * // 일반 회원만 조회
 * getUsers({ type: "user" });
 *
 * // 생일이 11월인 회원 조회
 * getUsers({ custom: { "extra.birthday": { $gte: "11", $lt: "12" } } });
 */
export async function getUsers(options?: GetUsersOptions): Promise<UserListRes | ErrorRes> {
  try {
    const params = new URLSearchParams();

    if (options) {
      const { _id, email, name, phone, type, address, custom, page, limit, sort } = options;

      if (_id) params.append("_id", String(_id));
      if (email) params.append("email", email);
      if (name) params.append("name", name);
      if (phone) params.append("phone", phone);
      if (type) params.append("type", type);
      if (address) params.append("address", address);
      if (custom) params.append("custom", JSON.stringify(custom));
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));
      if (sort) params.append("sort", JSON.stringify(sort));
    }

    const queryString = params.toString();
    const url = queryString ? `${API_URL}/users?${queryString}` : `${API_URL}/users`;

    const res = await fetch(url, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 회원 목록 조회에 실패했습니다." };
  }
}

/**
 * 회원 정보 조회 (단일)
 * @param {number} _id - 조회할 회원 id
 * @returns {Promise<UserRes | ErrorRes>} - 회원 정보 응답 객체
 * @example
 * // 회원 정보 조회
 * getUser(4);
 */
export async function getUser(_id: number): Promise<UserInfoRes | ErrorRes> {
  try {
    const res = await fetch(`${API_URL}/users/${_id}`, {
      headers: {
        "Client-Id": CLIENT_ID,
      },
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제로 회원 정보 조회에 실패했습니다." };
  }
}
