"use client";

import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import { Pencil } from "@/app/(main)/mypage/_components/Mark";
import MyItemList from "@/app/(main)/mypage/_components/MyItemListA";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { getOrders } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/zustand/useStore";
import { useEffect } from "react";
import { OrderListRes, ResData } from "@/types";
import { MyItemListSkeleton } from "@/app/(main)/mypage/(layout)/order/Skeleton";

export default function Orders() {
  const user = useUserStore((state) => state.user);
  const userName = user?.name || "회원";

  const token = Cookies.get("accessToken");
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const {
    data: resOrderlist,
    isLoading,
    isFetching,
  } = useQuery<ResData<OrderListRes>>({
    queryKey: ["orders", page],
    queryFn: () =>
      getOrders(token ?? "", {
        page,
        limit: 4,
        type: "user",
      }),
  });
  const getPeriodText = (color: string, size?: string) => {
    if (color === "subscription") {
      return size === "2w" ? "2주 주기 배송" : "4주 주기 배송";
    }
    return "1회 구매";
  };

  const pagination = resOrderlist?.ok === 1 ? resOrderlist.pagination : undefined;
  const showSkeleton = isLoading || isFetching;
  console.log(resOrderlist, "콘솔");

  return (
    <main className="w-full pb-[70px]">
      <div className="mt-[108px]">
        <h1 className="text-[#1A1A1C] text-center text-[26px] font-[900] px-4 break-keep">
          {userName}님이 이용 중인 <span className="text-[#FBA613]">주문 내역</span>입니다
        </h1>
      </div>

      <div className="mx-auto pt-[57px] pb-[100px] px-[20px] lg:px-0 max-w-[1280px]">
        <ul className="grid grid-cols-[repeat(auto-fill,240px)] gap-4 max-w-6xl mx-auto justify-center">
          {/* 1. 로딩 중일 때 스켈레톤 UI를 보여줍니다. */}
          {showSkeleton ? (
            Array.from({ length: 4 }).map((_, i) => (
              <li key={`skeleton-${i}`} className="w-full">
                <MyItemListSkeleton />
              </li>
            ))
          ) : resOrderlist?.ok && resOrderlist.item.length > 0 ? (
            /* 2. 로딩 완료 후 데이터 렌더링 */
            resOrderlist.item.map((item) => {
              const hasReview = !!item.products[0].review_id;
              return (
                <li key={item._id} className="w-full">
                  <MyItemList
                    subscriptionId={String(item.products[0]._id)}
                    productid={item.products[0]._id}
                    orderId={String(item._id)}
                    title={item.products[0].name}
                    showNextDelivery={false}
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
                          <div className="w-full h-full">
                            <Product404 className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    }
                    content={hasReview ? "리뷰 작성 완료" : "리뷰 작성"}
                    date={item.createdAt.split(" ")[0]}
                    period={getPeriodText(
                      item.products[0]?.color ?? "oneTime",
                      item.products[0].size,
                    )}
                    quantity={item.products[0].quantity}
                    price={`${item.products[0].price.toLocaleString()}원`}
                    mark={hasReview ? null : <Pencil />}
                    isReviewed={hasReview}
                  />
                </li>
              );
            })
          ) : (
            <li className="col-span-full py-20 text-center">
              <p className="text-[#909094] text-[18px] font-medium" role="status">
                현재 이용 중인 주문 내역이 없습니다.
              </p>
            </li>
          )}
        </ul>
      </div>

      <nav className="flex justify-center">
        <PaginationWrapper currentPage={page} totalPages={pagination?.totalPages || 1} />
      </nav>
    </main>
  );
}
