import Skeleton from "@/components/common/Skeleton";

export const ReviewCardSkeleton = () => (
  <div className="bg-white rounded-[3rem] border border-border-primary overflow-hidden flex flex-col">
    {/* 이미지 영역 */}
    <div className="relative overflow-hidden pt-[100%]">
      <Skeleton className="absolute inset-0" />

      <div className="absolute top-6 left-6">
        <div className="bg-gray-300/50 px-3 py-1.5 rounded-xl w-16 h-7" />
      </div>
    </div>

    {/* 컨텐츠 영역 */}
    <div className="p-8 grow flex flex-col">
      {/* 제목 */}
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-7 rounded-lg w-3/4" />
      </div>

      {/* 본문 */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 rounded w-full" />
        <Skeleton className="h-4 rounded w-full" />
        <Skeleton className="h-4 rounded w-4/5" />
      </div>

      <div className="mt-auto space-y-4">
        {/* 상품 정보 */}
        <div className="w-full flex items-center space-x-4 p-4 bg-bg-secondary rounded-2xl">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-2.5 rounded w-1/3" />
            <Skeleton className="h-3 rounded w-2/3" />
          </div>
        </div>

        {/* 하단 메타 */}
        <div className="flex items-center justify-between pt-4 border-t border-border-primary">
          <Skeleton className="h-2.5 rounded w-1/3" />
        </div>
      </div>
    </div>
  </div>
);
