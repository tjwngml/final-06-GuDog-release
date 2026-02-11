import { Metadata } from "next";

export const metadata: Metadata = {
  title: "설문 결과",
  description: "반려견을 위한 최적의 사료 추천 결과를 확인하세요.",
};

export default function SurveyResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
