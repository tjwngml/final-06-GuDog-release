import { Metadata } from "next";

export const metadata: Metadata = {
  title: "주문 내역",
  description: "9DOG 주문 내역 페이지입니다.",
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
