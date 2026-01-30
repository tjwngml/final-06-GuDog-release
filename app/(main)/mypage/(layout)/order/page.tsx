import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import { Pencil } from "@/app/(main)/mypage/_components/Mark";
import MyItemList from "@/app/(main)/mypage/_components/MyItemListA";
import PaginationWrapper from "@/components/common/PaginationWrapper";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

// 임시 데이터
const orderItems = [
  {
    id: 1,
    title: "나인독 정밀 사료A",
    href: "/mypage/orders/1",
    date: "2026.01.20",
    period: "2주 주기 배송",
    price: "45,800원",
  },
  {
    id: 2,
    title: "나인독 정밀 사료A",
    href: "/mypage/orders/1",
    date: "2026.01.20",
    period: "2주 주기 배송",
    price: "45,800원",
  },
  {
    id: 3,
    title: "나인독 정밀 사료A",
    href: "/mypage/orders/1",
    date: "2026.01.20",
    period: "2주 주기 배송",
    price: "45,800원",
  },
  {
    id: 4,
    title: "나인독 정밀 사료A",
    href: "/mypage/orders/1",
    date: "2026.01.20",
    period: "2주 주기 배송",
    price: "45,800원",
  },
];

export default async function Orders({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  // 임시 값
  const totalPages = 3;

  return (
    <div className="w-full min-w-[360px] pb-[70px]">
      <p className="mt-[108px] text-[#1A1A1C] text-center text-[26.3px] not-italic font-[900]">
        김구독님이 이용 중인
      </p>
      <div className="flex flex-row justify-center">
        <p className="text-[#FBA613] text-center text-[26.3px] not-italic font-[900]">주문 내역</p>
        <p className="text-[#1A1A1C] text-center text-[26.3px] not-italic font-[900]">입니다</p>
      </div>

      <div className="max-w-[1280px] mx-auto pt-[57px] pb-[100px] px-[20px] lg:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px] lg:gap-7 justify-items-center">
          {orderItems.map((item) => (
            <MyItemList
              key={item.id}
              title={item.title}
              image={
                <div className="rounded-3xl overflow-hidden w-full h-full">
                  <Product404 />
                </div>
              }
              href={item.href}
              content="리뷰 작성"
              date={item.date}
              period={item.period}
              price={item.price}
              mark={<Pencil />}
            />
          ))}
        </div>
      </div>
      {/* 페이지네이션 */}
      <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
