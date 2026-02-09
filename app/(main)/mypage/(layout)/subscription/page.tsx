"use client";

import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import { RigthMark } from "@/app/(main)/mypage/_components/Mark";
import MyItemList from "@/app/(main)/mypage/_components/MyItemListA";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import Image from "next/image";
import useUserStore from "@/zustand/useStore";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/order";
import Cookies from "js-cookie";

export default function Subscription() {
  const user = useUserStore((state) => state.user);
  const token = Cookies.get("accessToken");
  const userName = user?.name || "회원";
  const params = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data: resOrderlist, isLoading } = useQuery({
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

  const getPeriodText = (color: string, size?: string) => {
    if (color === "subscription") {
      return size === "2w" ? "2주 주기 배송" : "4주 주기 배송";
    }
  };

  return (
    <div className="w-full pb-[70px]">
      <div className="mt-[108px]">
        <p className="text-[#1A1A1C] text-center text-[26px] font-[900]">
          {userName}님이 이용 중인
        </p>
        <div className="flex flex-row justify-center">
          <p className="text-[#FBA613] text-center text-[26px] font-[900]">정기 구독 플랜</p>
          <p className="text-[#1A1A1C] text-center text-[26px] font-[900]">목록입니다</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-[57px] pb-[110px] px-[20px] lg:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 lg:gap-x-7 gap-y-10 justify-items-center max-w-[500px] md:max-w-[700px] lg:max-w-none mx-auto">
          {isLoading ? (
            <div className="col-span-full py-20 text-center">불러오는 중...</div>
          ) : resOrderlist?.ok === 1 && resOrderlist.item.length > 0 ? (
            resOrderlist.item.map((item) => (
              <div key={item._id} className="w-full max-w-[280px]">
                <MyItemList
                  subscriptionId={String(item._id)}
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
                  content="상세 보기"
                  date={item.createdAt.split(" ")[0]}
                  period={getPeriodText(
                    item.products[0]?.color ?? "oneTime",
                    item.products[0].size,
                  )}
                  quantity={item.products[0].quantity}
                  price={`${item.products[0].price.toLocaleString()}원`}
                  mark={<RigthMark />}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-[#909094]">
              현재 이용 중인 정기 구독 플랜이 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <PaginationWrapper
          currentPage={page}
          totalPages={resOrderlist?.ok === 1 ? resOrderlist.pagination.totalPages : 1}
        />
      </div>
    </div>
  );
}
