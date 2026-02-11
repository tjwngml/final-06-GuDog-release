import Skeleton from "@/components/common/Skeleton";

export default function ProductsSkeleton() {
  return (
    <li className="flex max-w-[250px] flex-col overflow-hidden rounded-3xl sm:rounded-[2.1875rem] border border-black/10 bg-white">
      {/* 이미지 영역 */}
      <div className="relative overflow-hidden pt-[100%]">
        <Skeleton className="absolute inset-0" />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex flex-col items-start gap-2 px-3 py-3 sm:px-4 sm:py-4">
        {/* 제목 - leading-6 (24px) */}
        <Skeleton className="h-6 rounded-lg w-3/4" />

        {/* 가격 - leading-6 (24px) */}
        <Skeleton className="h-6 rounded w-1/2" />

        {/* 라이프스테이지 태그들 - py-1 (상하 4px) + text height */}
        <div className="flex gap-1.5 flex-wrap">
          <Skeleton className="h-5 rounded-md w-16" />
          <Skeleton className="h-5 rounded-md w-20" />
        </div>
      </div>
    </li>
  );
}
