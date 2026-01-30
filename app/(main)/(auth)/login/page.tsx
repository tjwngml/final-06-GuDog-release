"use client";

import { login } from "@/app/(main)/(auth)/login/actions/user";
import useUserStore from "@/app/(main)/(auth)/login/zustand/useStore";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createJSONStorage } from "zustand/middleware";

export default function Login() {
  const [userState, formAction, isPending] = useActionState(login, null);
  const [checkedState, setcheckedState] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcheckedState(e.target.checked);
  };

  useEffect(() => {
    console.log(checkedState);
  }, [checkedState]);

  useEffect(() => {
    if (userState?.ok === 1) {
      if (checkedState) {
        localStorage.setItem("sessionStorage", userState.item.token.accessToken);
      }
      if (!checkedState) {
        sessionStorage.setItem("sessionStorage", userState.item.token.accessToken);
      }
    }
  }, [userState, checkedState]);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (userState?.ok === 1) {
      const storageType = checkedState ? localStorage : sessionStorage;

      // zustand persist 설정의 스토리지를 강제 변경
      useUserStore.persist.setOptions({
        storage: createJSONStorage(() => storageType),
      });

      setUser({
        _id: userState.item._id,
        email: userState.item.email,
        name: userState.item.name,
        image: userState.item.image,
        token: {
          accessToken: userState.item.token?.accessToken || "",
          refreshToken: userState.item.token?.refreshToken || "",
        },
      });
      console.log(userState.item._id);
      alert(`${userState.item.name}님 로그인이 완료되었습니다.`);
      redirect("/");
    }
  }, [userState, router, redirect, setUser]);

  return (
    <>
      <div className="bg-bg-secondary min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* 상단 로고 및 안내 */}
          <div className="flex flex-col items-center text-center mb-10">
            <Link href="/" className="flex items-center">
              <Image src="/images/logo.png" alt="9Dog" width={133} height={48} />
            </Link>
            <h2 className=" mt-2 text-2xl font-black text-text-primary tracking-tight mb-2">
              반가워요! 9DOG입니다
            </h2>
            <p className="text-sm font-medium text-text-tertiary">
              당신의 소중한 친구를 위한 영양 맞춤형 라이프
            </p>
          </div>

          {/* 로그인 폼 카드 */}
          <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-card border border-border-primary mb-8">
            <form className="space-y-4" action={formAction}>
              <Input label="이메일 주소" name="email" placeholder="hello@9dog.co.kr" />
              <Input label="비밀번호" name="password" placeholder="••••••••" type="password" />

              <div className="flex items-center justify-between pt-2 mb-6">
                <Checkbox checked={checkedState} onChange={handleChange} label="로그인 상태 유지" />
                <button className="text-xs font-bold text-text-tertiary hover:text-text-primary transition-colors underline underline-offset-4">
                  비밀번호 찾기
                </button>
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
          </div>

          {/* 하단 보조 액션 */}
          <div className="text-center">
            <p className="text-sm font-bold text-text-secondary">
              아직 9DOG 회원이 아니신가요?
              <Link
                href="/singup"
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
          </div>
        </div>
      </div>
    </>
  );
}
