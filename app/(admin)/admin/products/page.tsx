import { Suspense } from "react";
import ProductListContent from "./ProductListContent";

export default function ProductListPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProductListContent />
    </Suspense>
  );
}
