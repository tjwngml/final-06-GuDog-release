import { Metadata } from "next";

export const metadata: Metadata = {
  title: "반려견 건강 설문조사",
  description: "반려견의 정보를 입력하고 AI 건강 분석을 통해 최적의 사료를 추천받으세요.",
};

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
