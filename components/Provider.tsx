"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // useState를 사용해 QueryClient를 생성해야
  // 렌더링 시마다 클라이언트가 새로 생성되는 것을 방지할 수 있습니다.
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
