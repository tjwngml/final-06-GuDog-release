import { Metadata } from "next";

export const metadata: Metadata = {
  title: "결제",
  description: "9DOG 결제 페이지입니다.",
};
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
