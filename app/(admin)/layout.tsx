import "../globals.css";
import { AdminLayoutClient } from "@/components/layouts/AdminLayoutClient";
import { ReactNode } from "react";
import "pretendard/dist/web/variable/pretendardvariable.css";
import Providers from "@/app/provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen bg-gray-100">
        <Providers>
          <AdminLayoutClient>{children}</AdminLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
