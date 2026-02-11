import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "반려견 맞춤형 건강 사료 구독 서비스, 9DOG 시작하기",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
