"use client";

import "../globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { useState } from "react";

// export const metadata = {
//   title: "9Dog | 맞춤 애견 정기구독",
//   description: "반려견 라이프스타일 설문 기반 맞춤 사료·간식 정기구독",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
