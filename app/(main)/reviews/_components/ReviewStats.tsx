"use client";

import { useQuery } from "@tanstack/react-query";
import Badge from "@/components/common/Badge";
import StarRating from "@/components/common/StarRating";
import { getReviewStats } from "@/lib";

export default function ReviewStats() {
  const { data: stats } = useQuery({
    queryKey: ["reviewStats"],
    queryFn: () => getReviewStats(),
  });

  const average = stats?.average ?? 0;
  const total = stats?.total ?? 0;

  return (
    <section className="bg-white rounded-[4rem] p-12 md:p-16 border border-border-primary shadow-soft mb-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-64 h-64 bg-accent-soft/30 rounded-full blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="text-center md:text-left relative z-10">
        <Badge variant="accent" className="mb-4">
          REAL CUSTOMER REVIEWS
        </Badge>
        <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-4">
          견주님들이 보증하는 <br />
          <span className="text-accent-primary">9Dog의 정직함</span>
        </h2>
        <p className="text-text-secondary font-medium text-lg">
          실제 구매 고객님들이 남겨주신 소중한 기록입니다.
        </p>
      </div>

      <div className="flex items-center space-x-12 relative z-10">
        <div className="text-center">
          <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2">
            평균 평점
          </p>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-black text-text-primary">{average}</span>
            <StarRating className="mt-0.5" rating={average} size={16} aria-hidden="true" />
          </div>
        </div>
        <div className="w-px h-20 bg-border-primary hidden md:block" aria-hidden="true" />
        <div className="text-center">
          <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2">
            전체 리뷰 수
          </p>
          <span className="text-5xl font-black text-accent-primary">{total}</span>
          <p className="text-[10px] font-black text-text-tertiary mt-1" aria-hidden="true">
            REAL FEEDBACK
          </p>
        </div>
      </div>
    </section>
  );
}
