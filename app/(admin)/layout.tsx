import "../globals.css";
import { AdminLayoutClient } from "@/components/layouts/AdminLayoutClient";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="ko">
      <body className="flex min-h-screen bg-gray-100">
        <AdminLayoutClient children={children}/>
      </body>
    </html>
  );
}
