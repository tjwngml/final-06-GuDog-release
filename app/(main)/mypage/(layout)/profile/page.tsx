import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "@/actions/profile";
import { getUser } from "@/lib";

export const metadata: Metadata = {
  title: "회원 정보",
  description: "9DOG 회원 정보 페이지입니다.",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    redirect("/login");
  }

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const payload = JSON.parse(decodedPayload);

    const userId = payload._id || payload.id;

    if (!userId) {
      throw new Error("유저 ID를 찾을 수 없습니다.");
    }

    const res = await getUser(userId);

    const userData = "item" in res ? res.item : null;

    if (!userData) {
      return (
        <main className="flex flex-col items-center pt-20">
          <div role="alert" aria-live="assertive">
            <p>사용자 정보를 불러올 수 없습니다.</p>
          </div>
          <button onClick={() => redirect("/login")} className="mt-4 text-orange-500 underline">
            다시 로그인하기
          </button>
        </main>
      );
    }

    return <ProfileClient token={token} user={userData} />;
  } catch (error) {
    console.error("프로필 페이지 에러:", error);
    redirect("/login");
  }
}
