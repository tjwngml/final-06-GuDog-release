"use client";

import "./globals.css";
import Button from "@/components/common/Button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="bg-bg-secondary min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden relative">
      {/* 배경 장식 요소 */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent-soft rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-[120px] opacity-40"></div>

      <div className="container-custom max-w-[700px] text-center relative z-10">
        <div className="space-y-8">
          <div className="relative w-64 h-64 md:w-110 md:h-110 mx-auto">
            <Image src="/images/404.png" alt="404 에러" fill className="object-contain" priority />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium max-w-lg mx-auto">
              요청하신 페이지가 존재하지 않거나 삭제되었습니다.
            </p>
          </div>

          <div className="pt-4">
            <Button variant="primary" href="/">
              메인으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
