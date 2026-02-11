import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "9DOG에 회원가입하고 우리 아이를 위한 맞춤 건강 식단을 관리하세요.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
