"use client";

import { login } from "@/actions/user";
import useUserStore from "@/zustand/useStore";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createJSONStorage } from "zustand/middleware";
import { showSuccess } from "@/lib";

export default function Login() {
  const [userState, formAction, isPending] = useActionState(login, null);
  const [checkedState, setcheckedState] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcheckedState(e.target.checked);
  };

  useEffect(() => {
    if (userState?.ok === 1) {
      const storageType = !checkedState ? localStorage : sessionStorage;
      const token = userState.item.token?.accessToken;
      const LONG_LIVED = 60 * 60 * 24 * 365 * 10;
      const cookieExpires = checkedState ? `max-age=${LONG_LIVED}` : "";
      // const cookieExpires = checkedState ? `max-age=${60 * 60 * 24 * 7}` : "";
      document.cookie = `accessToken=${token}; path=/; ${cookieExpires}; SameSite=Lax;`;

      useUserStore.persist.setOptions({
        storage: createJSONStorage(() => storageType),
      });

      setUser({
        ...userState.item,
        token: {
          accessToken: userState.item.token?.accessToken || "",
          refreshToken: userState.item.token?.refreshToken || "",
        },
      });
      showSuccess(`${userState.item.name}님 로그인이 완료되었습니다.`);
      router.push("/");
    }
    // else {
    //   // 서버에서 보내주는 에러 메시지가 있다면 userState.message 등을 사용하고,
    //   // 없다면 기본 문구를 출력합니다.
    //   Swal.fire({
    //     icon: "error",
    //     title: userState?.message || "아이디 또는 비밀번호를 다시 확인해주세요.",
    //   });
    // }
  }, [userState, router, redirect, setUser, checkedState]);

  return (
    <>
      <div className="bg-bg-secondary min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* 상단 로고 및 안내 */}
          <header className="flex flex-col items-center text-center mb-10">
            <Link href="/" className="flex items-center">
              <Image src="/images/logo.png" alt="9Dog 홈으로 가기" width={133} height={48} />
            </Link>
            <h1 className=" mt-2 text-2xl font-black text-text-primary tracking-tight mb-2">
              반가워요! 9DOG입니다
            </h1>
            <p className="text-sm font-medium text-text-tertiary">
              당신의 소중한 친구를 위한 영양 맞춤형 라이프
            </p>
          </header>

          {/* 로그인 폼 카드 */}
          <main className="bg-white rounded-[3rem] p-10 md:p-12 shadow-card border border-border-primary mb-8">
            {userState?.ok === 0 && (
              <div
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-bold"
                role="alert"
                aria-live="assertive"
              >
                {"아이디 또는 비밀번호를 확인해주세요."}
              </div>
            )}

            <form className="space-y-4" action={formAction}>
              <Input label="이메일 주소" name="email" placeholder="hello@9dog.co.kr" />
              <Input label="비밀번호" name="password" placeholder="••••••••" type="password" />

              <div className="flex items-center justify-between pt-2 mb-6">
                <Checkbox checked={checkedState} onChange={handleChange} label="로그인 상태 유지" />
                {/* <button
                  type="button"
                  className="text-xs font-bold text-text-tertiary hover:text-text-primary transition-colors underline underline-offset-4"
                  aria-label="비밀번호 찾기"
                >
                  비밀번호 찾기
                </button> */}
              </div>

              <Button
                disabled={isPending}
                type="submit"
                variant="primary"
                className="w-full py-5 text-lg rounded-2xl shadow-glow"
              >
                로그인
              </Button>
            </form>
          </main>

          {/* 하단 보조 액션 */}
          <nav className="text-center" aria-label="보조 메뉴">
            <p className="text-sm font-bold text-text-secondary">
              아직 9DOG 회원이 아니신가요?
              <Link
                href="/signup"
                className="ml-2 text-accent-primary font-black hover:underline underline-offset-4 transition-all"
              >
                회원가입 하기
              </Link>
            </p>
            <Link
              href="/"
              className="inline-block mt-7 text-xs font-black text-text-tertiary hover:text-text-primary uppercase tracking-[0.2em] transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
