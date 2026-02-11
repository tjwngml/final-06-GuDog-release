import "../globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "pretendard/dist/web/static/pretendard.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://final-06-gu-dog-release.vercel.app"),

  title: {
    default: "반려견 맞춤형 건강 식단 구독 서비스",
    template: "%s - 9DOG",
  },
  description: "건강한 반려견 사료와 간식을 정기구독으로 만나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="front-page">
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
    </div>
  );
}
