"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { getAllReplies } from "@/lib";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import { ReviewCard } from "./ReviewCard";
import { ReviewCardSkeleton } from "./ReviewCard/Skeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { ReviewFilters } from "./ReviewFilters";

type SortType = "new" | "old";
type RatingFilter = "all" | "1" | "2" | "3" | "4" | "5";

const ITEMS_PER_PAGE = 6;

export default function ReviewList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ratingFilter = (searchParams.get("rating") || "all") as RatingFilter;
  const sort = (searchParams.get("sort") || "new") as SortType;
  const currentPage = Number(searchParams.get("page")) || 1;

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews", ratingFilter, sort, currentPage],
    queryFn: async () => {
      const sortParam: Record<string, 1 | -1> =
        sort === "new" ? { createdAt: -1 } : { createdAt: 1 };

      const res = await getAllReplies({
        rating: ratingFilter === "all" ? undefined : ratingFilter,
        sort: sortParam,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      if (!res.ok) {
        throw new Error(res.message || "리뷰를 불러오는데 실패했습니다.");
      }

      return res;
    },
  });

  const reviews = reviewsData?.ok === 1 ? reviewsData.item : [];
  const totalPages = reviewsData?.ok === 1 ? reviewsData.pagination?.totalPages : 0;

  const handleRatingFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({
      rating: e.target.value === "all" ? null : e.target.value,
      page: null,
    });
  };

  const handleSortChange = (newSort: SortType) => {
    updateSearchParams({
      sort: newSort === "new" ? null : newSort,
      page: null,
    });
  };

  return (
    <>
      {/* 필터 및 정렬 바 */}
      <ReviewFilters
        ratingFilter={ratingFilter}
        sort={sort}
        isLoading={isLoading}
        onRatingFilterChange={handleRatingFilterChange}
        onSortChange={handleSortChange}
      />

      {/* 리뷰 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in duration-700">
        {isLoading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))
        ) : isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."}
            onRetry={() => refetch()}
          />
        ) : reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} review={review} />)
        ) : (
          <EmptyState />
        )}
      </div>

      {/* 페이징 */}
      {!isLoading && !isError && reviews.length > 0 && (
        <PaginationWrapper currentPage={currentPage} totalPages={totalPages} paramKey="page" />
      )}

      {/* 하단 CTA */}
      <div className="mt-32 p-16 bg-text-primary rounded-[4rem] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter relative z-10">
          아이의 변화를 <span className="text-accent-primary">직접 경험</span>해 보세요
        </h3>
        <p className="text-white/60 font-medium mb-12 relative z-10">
          지금 정기 구독을 시작하면 10% 할인 혜택을 드립니다.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Button href="/survey" variant="primary">
            맞춤 사료 찾으러 가기
          </Button>
        </div>
      </div>
    </>
  );
}
