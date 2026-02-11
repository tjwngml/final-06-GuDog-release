import { Metadata } from "next";

export const metadata: Metadata = {
  title: "자주 묻는 질문 (FAQ)",
  description: "9DOG FAQ 페이지입니다.",
};

export default function Faq() {
  return (
    <main className="bg-bg-secondary min-h-screen pb-40 pt-20">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-8">
          자주 묻는 질문
        </h1>
        <div role="region">
          <p className="text-text-secondary">FAQ 콘텐츠가 추가될 예정입니다.</p>
        </div>
      </div>
    </main>
  );
}
