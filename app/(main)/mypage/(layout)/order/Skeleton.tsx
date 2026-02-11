import Skeleton from "@/components/common/Skeleton";

export function MyItemListSkeleton() {
  return (
    <div className="rounded-[42px] border border-[rgba(0,0,0,0.06)] bg-[#FFFFFF] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)]">
      {/* 이미지 영역 */}
      <div className="mt-[30px] ml-[30px] mr-[30px]">
        <div className="rounded-3xl overflow-hidden w-full aspect-square relative">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* 타이틀 영역 */}
      <div className="pt-[27px] pl-[29px] pb-[14.5px]">
        <Skeleton className="h-[18px] w-3/4 rounded-lg" />
      </div>

      {/* 주문일 */}
      <div className="flex px-[29px] justify-between">
        <Skeleton className="h-3 w-10 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>

      {/* 수량 */}
      <div className="flex mt-[7px] px-[29px] justify-between">
        <Skeleton className="h-3 w-8 rounded" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>

      {/* 주기 */}
      <div className="flex my-[7px] px-[29px] justify-between">
        <Skeleton className="h-3 w-8 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>

      {/* 구분선 */}
      <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)]" />

      {/* 결제 금액 영역 */}
      <div className="pb-9 pt-[15px] flex pl-[29px] justify-between pr-[29px]">
        <Skeleton className="h-3 w-14 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>

      {/* 하단 구분선 */}
      <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)]" />

      {/* 하단 버튼 영역 */}
      <div className="w-full flex justify-center gap-[12px] items-center px-[29px] py-[20px]">
        <Skeleton className="h-[11px] w-16 rounded" />
        <Skeleton className="h-[11px] w-[11px] rounded" />
      </div>
    </div>
  );
}
