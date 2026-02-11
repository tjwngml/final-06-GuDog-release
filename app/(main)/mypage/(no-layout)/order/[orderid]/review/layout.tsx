import { Metadata } from "next";

export const metadata: Metadata = {
  title: "후기 작성",
  description: "9DOG 주문 상품 후기 작성 페이지입니다.",
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
