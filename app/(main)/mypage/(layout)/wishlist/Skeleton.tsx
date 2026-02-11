import Skeleton from "@/components/common/Skeleton";

export const ProductCardSkeleton = () => (
  <div className="rounded-[42px] border border-[rgba(0,0,0,0.06)] bg-[#FFFFFF] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] overflow-hidden">
    {/* 이미지 영역 */}
    <div className="pt-[30px] pl-[30px] pr-[30px] w-full">
      <Skeleton className="w-full aspect-square rounded-[24px]" />
    </div>

    {/* 상품명 & 삭제 버튼 영역 */}
    <div className="flex justify-between items-center mt-[27px] px-[29px] pb-[14.5px]">
      <Skeleton className="h-[18px] rounded w-2/3" />
      <Skeleton className="w-5 h-5 rounded" />
    </div>

    {/* 구분선 */}
    <div className="w-[calc(100%-58px)] h-px mx-auto bg-[rgba(0,0,0,0.06)]" />

    {/* 가격 영역 */}
    <div className="pb-[36px] pt-[15px] flex pl-[29px] justify-between pr-[29px]">
      <Skeleton className="h-[12px] rounded w-16" />
      <Skeleton className="h-[12px] rounded w-20" />
    </div>

    {/* 링크 영역 (빈 영역이지만 구조 유지) */}
    <div className="pt-[20px] flex flex-row pl-[29px] justify-center gap-[12px]" />
  </div>
);
