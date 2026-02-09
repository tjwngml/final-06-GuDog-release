"use client";

import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import { Pencil } from "@/app/(main)/mypage/_components/Mark";
import MyItemList from "@/app/(main)/mypage/_components/MyItemListA";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { getOrders } from "@/lib/order";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/zustand/useStore";
import { useEffect } from "react";
import { OrderListRes, ResData } from "@/types/response";

export default function Orders() {
  const user = useUserStore((state) => state.user);
  const userName = user?.name || "회원";

  const token = Cookies.get("accessToken");
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data: resOrderlist, isLoading } = useQuery<ResData<OrderListRes>>({
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

  return (
    <div className="w-full pb-[70px]">
      <div className="mt-[108px]">
        <p className="text-[#1A1A1C] text-center text-[26.3px] font-[900]">
          {userName}님이 이용 중인
        </p>
        <div className="flex flex-row justify-center">
          <p className="text-[#FBA613] text-center text-[26.3px] font-[900]">주문 내역</p>
          <p className="text-[#1A1A1C] text-center text-[26.3px] font-[900]">입니다</p>
        </div>
      </div>

      <div className="mx-auto pt-[57px] pb-[100px] px-[20px] lg:px-0 max-w-[1280px]">
        <div
          className="grid 
          grid-cols-2 lg:grid-cols-4 
          gap-x-[15px] md:gap-x-[40px] lg:gap-x-7 
          gap-y-10
          justify-items-center
          max-w-[500px] md:max-w-[700px] lg:max-w-none mx-auto"
        >
          {resOrderlist?.ok && resOrderlist.item.length > 0 ? (
            resOrderlist.item.map((item) => {
              const hasReview = !!item.products[0].review_id;
              return (
                <div key={item._id} className="w-full">
                  <MyItemList
                    productid={item.products[0]._id}
                    orderId={String(item._id)}
                    title={item.products[0].name}
                    image={
                      <div className="rounded-3xl overflow-hidden w-full aspect-square relative bg-gray-50">
                        {item.products[0].image?.path ? (
                          <Image
                            src={item.products[0].image?.path}
                            alt={item.products[0].name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <Product404 />
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
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#909094] text-[18px] font-medium">
                현재 이용 중인 주문 내역이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <PaginationWrapper currentPage={page} totalPages={pagination?.totalPages || 1} />
      </div>
    </div>
  );
}
