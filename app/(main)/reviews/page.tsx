import { Metadata } from "next";
import ReviewList from "@/app/(main)/reviews/_components/ReviewList";
import ReviewStats from "@/app/(main)/reviews/_components/ReviewStats";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "구매 후기",
  description: "9DOG을 이용한 견주님들이 후기 페이지입니다.",
};

export default function ReviewListPage() {
  return (
    <div className="bg-bg-secondary min-h-screen pb-40 pt-20">
      <div className="container-custom">
        <h1 className="sr-only">고객 후기</h1>
        <main>
          <ReviewStats />
          <Suspense
            fallback={
              <div role="status" aria-live="polite">
                후기를 불러오는 중...
              </div>
            }
          >
            <ReviewList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
