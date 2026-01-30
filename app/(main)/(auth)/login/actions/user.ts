"use server";

import { UserInfoRes } from "./../../../../../types/response";

import { User } from "@/types/user";

// interface User {
//   _id: number;
//   email: string;
//   name: string;
//   phone: string;
//   address: string;
//   type: string;
//   loginType: string;
//   image?: string;
//   token?: {
//     accessToken: string;
//     refreshToken: string;
//   };
// }

interface ServerValidationError {
  type: string;
  value: string;
  msg: string;
  location: string;
}

interface ErrorRes {
  ok: 0;
  message: string;
  errors?: {
    [fieldName: string]: ServerValidationError;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

type UserActionState = UserInfoRes | ErrorRes | null;

// 로그인
export async function login(state: UserActionState, formData: FormData): Promise<UserActionState> {
  const body = Object.fromEntries(formData.entries());

  let res: Response;
  let data: UserInfoRes | ErrorRes;

  try {
    // 로그인 api 호출
    res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    //네트워크 에러 처리
    console.error(error);
    return { ok: 0, message: "일시적인 네트워크 문제가 발생했습니다." };
  }
  return data;
}
