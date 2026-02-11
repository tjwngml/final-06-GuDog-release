import Providers from "@/app/Provider";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://final-06-gu-dog-release.vercel.app"),

  title: {
    default: "반려견 건강 식단 정기 구독 서비스- 9DOG",
    template: "%s - 9DOG",
  },
  description:
    "데이터로 그리는 가장 정밀한 건강 지도. 반려견의 생체 리듬과 활동량, 알러지 정보까지 모두 통합하여 가장 과학적인 한 그릇을 설계합니다.",
  openGraph: {
    title: "반려견 맞춤형 건강 식단 구독 서비스 - 9DOG",
    description:
      "데이터로 그리는 가장 정밀한 건강 지도. 반려견의 생체 리듬과 활동량, 알러지 정보까지 모두 통합하여 가장 과학적인 한 그릇을 설계합니다.",
    url: "https://final-06-gu-dog-release.vercel.app",
    images: [
      {
        url: "https://final-06-gu-dog-release.vercel.app/images/ogimage.png",
        width: 1200,
        height: 630,
        alt: "9DOG - 반려견 건강 식단 정기 구독 서비스",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
