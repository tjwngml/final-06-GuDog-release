import ReviewList from "@/app/(main)/reviews/_components/ReviewList";
import ReviewStats from "@/app/(main)/reviews/_components/ReviewStats";
import { getAllReplies } from "@/lib";
import { Suspense } from "react";

export default async function ReviewListPage() {
  // 초기 데이터 fetch
  const initialData = await getAllReplies({
    page: 1,
    limit: 6,
    sort: { createdAt: -1 },
  });

  const total = initialData?.ok === 1 ? (initialData.pagination?.total ?? 0) : 0;

  return (
    <div className="bg-bg-secondary min-h-screen pb-40 pt-20">
      <div className="container-custom">
        <ReviewStats total={total} />
        <Suspense fallback={<div>Loading...</div>}>
          <ReviewList />
        </Suspense>
      </div>
    </div>
  );
}
