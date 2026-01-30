// app/(main)/mypage/wishlist/page.tsx

import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import WishlistComponent from "@/app/(main)/mypage/_components/wishlist";
import PaginationWrapper from "@/components/common/PaginationWrapper";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

// 임시 데이터
const wishlistItems = [
  {
    id: 1,
    title: "나인독 정밀 사료A",
    href: "/products/1",
    price: "45,800원",
  },
  {
    id: 2,
    title: "나인독 정밀 사료A",
    href: "/products/1",
    price: "45,800원",
  },
  {
    id: 3,
    title: "나인독 정밀 사료A",
    href: "/products/1",
    price: "45,800원",
  },
  {
    id: 4,
    title: "나인독 정밀 사료A",
    href: "/products/1",
    price: "45,800원",
  },
];

export default async function Wishlist({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  // 임시 값
  const totalPages = 3;

  return (
    <div className="w-full min-w-[360px] pb-[70px]">
      <div className="mt-[108px]">
        <p className="text-[#1A1A1C] text-center text-[26.3px] not-italic font-[900]">
          김구독님이 저장한
        </p>
        <div className="flex flex-row justify-center">
          <p className="text-[#FBA613] text-center text-[26.3px] not-italic font-[900]">
            관심 상품
          </p>
          <p className="text-[#1A1A1C] text-center text-[26.3px] not-italic font-[900]">
            목록입니다
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-[57px] pb-[100px] px-[20px] lg:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px] lg:gap-7 justify-items-center">
          {wishlistItems.map((item) => (
            <WishlistComponent
              key={item.id}
              title={item.title}
              image={
                <div className="rounded-3xl overflow-hidden w-full h-full">
                  <Product404 />
                </div>
              }
              href={item.href}
              content="상세 보기"
              price={item.price}
            />
          ))}
        </div>
      </div>
      {/* 페이지네이션 */}
      <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
