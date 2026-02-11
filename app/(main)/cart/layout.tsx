import { Metadata } from "next";

export const metadata: Metadata = {
  title: "장바구니",
  description: "9DOG 장바구니 페이지입니다.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
