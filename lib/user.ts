"use server";

import { ResData, UserInfoRes, UserListRes } from "@/types";
import { cookies } from "next/headers";

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
 * @returns {Promise<ResData<UserListRes>>} - 회원 목록 응답 객체
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
export async function getUsers(options?: GetUsersOptions): Promise<ResData<UserListRes>> {
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
 * @returns {Promise<ResData<UserInfoRes>>} - 회원 정보 응답 객체
 * @example
 * // 회원 정보 조회
 * getUser(4);
 */
export async function getUser(_id: number): Promise<ResData<UserInfoRes>> {
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

// ... 기존 interface들

interface UpdateUserOptions {
  name?: string;
  phone?: string;
  extra?: {
    address?: {
      id: number;
      name: string;
      value: string;
    }[];
    [key: string]: unknown; // 다른 추가 필드 대응을 위한 인덱스 시그니처
  };
}

/**
 * 회원 정보 수정
 * @param {number | string} _id - 수정할 회원 id
 * @param {UpdateUserOptions} data - 수정할 회원 정보
 * @returns {Promise<ResData<UserInfoRes>>} - 수정된 회원 정보 응답 객체
 * @example
 * // 이름과 전화번호 수정
 * updateUser(4, { name: "길드래곤", phone: "01099998888" });
 *
 * // 주소 정보(extra) 수정
 * updateUser(4, {
 * extra: {
 * address: [
 * { id: 1, name: "회사", value: "서울시 강남구 삼성동 111" },
 * { id: 2, name: "학교", value: "서울시 강남구 역삼동 222" }
 * ]
 * }
 * });
 */
export async function updateUser(
  _id: number | string,
  data: UpdateUserOptions,
): Promise<ResData<UserInfoRes>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const res = await fetch(`${API_URL}/users/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: "일시적인 네트워크 문제로 회원 정보 수정에 실패했습니다.",
    };
  }
}

// 회원가입 요청 데이터 인터페이스
interface SignupOptions {
  type: "user" | "seller";
  email: string;
  password: string;
  name: string;
  phone?: string; // 선택 사항이 있다면 추가
  address?: string; // 선택 사항이 있다면 추가
}

/**
 * 회원가입
 * @param {SignupOptions} data - 회원가입 정보 (type, email, password, name 필수)
 * @returns {Promise<UserInfoRes | ErrorRes>} - 가입된 회원 정보 또는 에러 객체
 * @example
 * // 일반 회원가입
 * signup({
 * type: "user",
 * email: "gangrock@gmail.com",
 * password: "123123",
 * name: "백강록"
 * });
 */
export async function signup(data: SignupOptions): Promise<ResData<UserInfoRes>> {
  try {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Signup Error:", error);
    return {
      ok: 0,
      message: "일시적인 네트워크 문제로 회원가입에 실패했습니다.",
    };
  }
}
