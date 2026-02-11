"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import Link from "next/link";
import { getProducts } from "@/lib";
import ProductsSkeleton from "@/app/(main)/products/_components/productsList/Skeleton";
import ProductCard from "@/components/common/ProductCard";

// 상품 목록 페이지
export default function Products() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsLoading() {
  return (
    <main
      className="w-full min-w-90 bg-bg-secondary px-4 py-10 lg:py-17.5 lg:pb-35"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex flex-col items-center gap-8 sm:gap-10 lg:gap-14">
        <section className="flex w-full max-w-290 flex-col items-center text-center px-2">
          <h1 className="pb-3 text-2xl sm:text-3xl lg:text-[2.625rem]">상품 목록</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            아이의 연령대와 건강 상태에 맞게 설계된 프리미엄 영양 식단을 만나보세요.
          </p>
        </section>
        <section className="w-full">
          <ul className="grid grid-cols-[repeat(auto-fill,240px)] gap-4 max-w-6xl mx-auto justify-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductsSkeleton key={i} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();

  const lifeStage = searchParams.get("lifeStage") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const custom = {
    ...(lifeStage && { "extra.lifeStage": lifeStage }),
    ...(category && { "extra.category": category }),
    "extra.type": type || "사료",
  };

  const {
    data: resProducts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", lifeStage, category, type, currentPage],
    queryFn: () => getProducts({ custom, page: currentPage, limit: 12, showSoldOut: true }),
  });

  const products = resProducts?.ok === 1 ? resProducts.item : [];
  const totalPages = resProducts?.ok === 1 ? resProducts.pagination.totalPages : 0;

  return (
    <main className="w-full min-w-90 bg-bg-secondary px-4 py-10 lg:py-17.5 lg:pb-35">
      <div className="mx-auto flex flex-col items-center gap-8 sm:gap-10 lg:gap-14">
        <section className="flex w-full max-w-290 flex-col items-center text-center px-2">
          <h1 className="pb-3 text-2xl sm:text-3xl lg:text-[2.625rem]">상품 목록</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            아이의 연령대와 건강 상태에 맞게 설계된 프리미엄 영양 식단을 만나보세요.
          </p>
        </section>

        {/* 필터 태그 - 사료일 때만 표시 */}
        {(!type || type === "사료") && (
          <nav className="w-full flex justify-center">
            {/* 바깥 캡슐 */}
            <div className="flex flex-col sm:flex-row items-center rounded-3xl sm:rounded-[2.25rem] border border-black/10 bg-white p-2 sm:p-1.75 shadow-[0_20px_60px_rgba(0,0,0,0.08)] w-full max-w-70 sm:max-w-none sm:w-auto gap-1 sm:gap-0">
              {[
                { label: "전체보기", value: "" },
                { label: "퍼피 (Puppy)", value: "퍼피" },
                { label: "성견 (Adult)", value: "성견" },
                { label: "시니어 (Senior)", value: "시니어" },
              ].map((filter) => {
                const isActive = lifeStage === filter.value || (!lifeStage && filter.value === "");
                const params = new URLSearchParams();
                if (filter.value) params.set("lifeStage", filter.value);
                if (category) params.set("category", category);
                if (type) params.set("type", type);
                const href = params.toString() ? `/products?${params.toString()}` : "/products";

                return (
                  <Link
                    key={filter.label}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative h-10 sm:h-12.5 w-full sm:w-28 md:w-32 lg:w-38 rounded-[1.25rem] sm:rounded-[1.75rem] text-xs sm:text-sm text-center flex items-center justify-center ${
                      isActive
                        ? "bg-accent-primary text-white font-extrabold"
                        : "bg-transparent text-text-tertiary font-bold hover:text-text-primary"
                    }`}
                  >
                    {filter.label}
                    {isActive && (
                      <span
                        className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-40 -translate-x-1/2 rounded-full bg-accent-primary/40 blur-2xl hidden sm:block"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        {/* 상품 목록 그리드 */}
        <section className="w-full">
          <ul
            className="grid grid-cols-[repeat(auto-fill,240px)] gap-4 max-w-6xl mx-auto justify-center"
            role="list"
          >
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => <ProductsSkeleton key={i} />)
            ) : isError ? (
              <li role="alert" aria-live="assertive" className="col-span-full text-center py-10">
                <p>상품을 불러오지 못했습니다.</p>
              </li>
            ) : (
              products.map((product) => <ProductCard key={product._id} product={product} />)
            )}
          </ul>
        </section>

        {/* 페이지네이션 */}
        <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}
