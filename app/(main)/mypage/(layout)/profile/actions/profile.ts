"use server";

import { ErrorRes, PostInfoRes } from "@/types/response";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

type ActionState = PostInfoRes | ErrorRes | null;

export async function uploadFiles(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accessToken = formData.get("accessToken") as string;

  if (!accessToken) {
    redirect("/login");
  }

  formData.delete("accessToken");

  let redirectTo: string | null = null; // 리다이렉트할 경로를 저장할 변수

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    console.log(res);

    // 401 에러(토큰 만료) 처리
    if (res.status === 401) {
      redirectTo = "/login";
    } else {
      const data: PostInfoRes | ErrorRes = await res.json();

      if (res.ok && data.ok === 1) {
        revalidatePath("/mypage/profile");
        redirectTo = "/mypage/profile"; // 성공 시 이동할 경로
      } else {
        return data as ErrorRes; // 실패 시 에러 객체 반환 (함수 종료)
      }
    }
  } catch (error) {
    // 만약 error가 Next.js의 리다이렉트 에러라면 다시 던져줘야 함
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error(error);
    return { ok: 0, message: "네트워크 에러 발생" };
  }

  // 모든 try...catch가 끝난 후 마지막에 리다이렉트 실행
  if (redirectTo) {
    redirect(redirectTo);
  }

  return null; // 기본 반환값
}
