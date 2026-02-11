"use client";

import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import { RigthMark } from "@/app/(main)/mypage/_components/Mark";
import MyItemList from "@/app/(main)/mypage/_components/MyItemListA";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import Image from "next/image";
import useUserStore from "@/zustand/useStore";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib";
import Cookies from "js-cookie";
import { MyItemListSkeleton } from "@/app/(main)/mypage/(layout)/order/Skeleton";

export default function Subscription() {
  const user = useUserStore((state) => state.user);
  const token = Cookies.get("accessToken");
  const userName = user?.name || "회원";
  const params = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const {
    data: resOrderlist,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["orders", page],
    queryFn: () =>
      getOrders(token ?? "", {
        page,
        limit: 4,
        path: params,
        type: "user",
      }),
    // enabled: !!token,
  });

  const addDays = (dateString: string, days: number): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getPeriodText = (color: string, size?: string) => {
    if (color === "subscription") {
      return size === "2w" ? "2주 주기 배송" : "4주 주기 배송";
    }
  };

  const showSkeleton = isLoading || isFetching;

  return (
    <main className="w-full pb-[70px]">
      <div className="mt-[108px]">
        <h1 className="text-[#1A1A1C] text-center text-[26px] font-[900] px-4 break-keep">
          {userName}님이 이용 중인 <span className="text-[#FBA613]">정기 구독 플랜</span> 목록입니다
        </h1>
      </div>

      <div className="max-w-[1280px] mx-auto pt-[57px] pb-[110px] px-[20px] lg:px-0">
        <ul className="grid grid-cols-[repeat(auto-fill,240px)] gap-4 max-w-6xl mx-auto justify-center">
          {showSkeleton ? (
            Array.from({ length: 4 }).map((_, i) => (
              <li key={`skeleton-${i}`} className="w-full max-w-[280px]">
                <MyItemListSkeleton />
              </li>
            ))
          ) : resOrderlist?.ok === 1 && resOrderlist.item.length > 0 ? (
            resOrderlist.item.map((item) => {
              // 1. 기본 생성일 가져오기
              const createdDate = item.createdAt.split(" ")[0];
              // 2. 만약 API에서 받은 nextdeliverydate가 없으면 생성일 + 3일 적용
              const defaultNextDelivery = item.nextdeliverydate || addDays(createdDate, 3);

              return (
                <li key={item._id} className="w-full max-w-[280px]">
                  <MyItemList
                    subscriptionId={String(item._id)}
                    title={item.products[0].name}
                    image={
                      <div className="rounded-3xl overflow-hidden w-full aspect-square relative bg-gray-50">
                        {item.products[0].image?.path ? (
                          <Image
                            src={item.products[0].image?.path}
                            alt={`${item.products[0].name} 상품 이미지`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <Product404 />
                        )}
                      </div>
                    }
                    content="상세 보기"
                    date={item.createdAt.split(" ")[0]}
                    period={getPeriodText(
                      item.products[0]?.color ?? "oneTime",
                      item.products[0].size,
                    )}
                    quantity={item.products[0].quantity}
                    price={`${item.products[0].price.toLocaleString()}원`}
                    mark={<RigthMark />}
                    nextdeliverydate={defaultNextDelivery}
                  />
                </li>
              );
            })
          ) : (
            <li className="col-span-full py-20 text-center text-[#909094]">
              <p role="status">현재 이용 중인 정기 구독 플랜이 없습니다.</p>
            </li>
          )}
        </ul>
      </div>

      <nav className="flex justify-center">
        <PaginationWrapper
          currentPage={page}
          totalPages={resOrderlist?.ok === 1 ? resOrderlist.pagination.totalPages : 1}
        />
      </nav>
    </main>
  );
}
