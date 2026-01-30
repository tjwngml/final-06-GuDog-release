"use client";

import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Link from "next/link";

export default function Singup() {
  return (
    <>
      <div className="bg-bg-secondary min-h-screen py-20 px-4">
        <div className="max-w-125 mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* 상단 섹션 */}
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">
              JOIN US
            </Badge>
            <h2 className="text-2xl font-black text-text-primary tracking-tight">
              새로운 가족이 되어주세요
            </h2>
            <p className="text-sm font-medium text-text-tertiary mt-2">
              아이의 건강을 위한 첫 걸음, 9독과 함께해요
            </p>
          </div>

          {/* 회원가입 폼 */}
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-card border border-border-primary">
            <form className="space-y-8">
              {/* 이메일 */}
              <Input label="이메일 계정" placeholder="example@9dog.co.kr" />

              {/* 비밀번호 */}
              <Input
                isError
                label="비밀번호"
                type="password"
                placeholder="영문, 숫자 조합 8자 이상"
                errorMessage="비밀번호를 입력해주세요."
              />

              {/* 비밀번호 확인 */}
              <Input label="비밀번호 확인" type="password" placeholder="한 번 더 입력해주세요" />

              <Button
                variant="primary"
                type="submit"
                className="w-full py-5 text-lg rounded-[1.8rem] shadow-glow mt-6"
              >
                가입하고 시작하기
              </Button>
            </form>
          </div>

          {/* 푸터 보조 액션 */}
          <div className="text-center mt-12">
            <p className="text-sm font-bold text-text-secondary">
              이미 계정이 있으신가요?
              <Link
                href="/login"
                className="ml-2 text-accent-primary font-black hover:underline underline-offset-4 transition-all"
              >
                로그인 하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
