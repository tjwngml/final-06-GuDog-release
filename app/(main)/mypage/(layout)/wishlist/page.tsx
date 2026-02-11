import { ProductCardSkeleton } from "@/app/(main)/mypage/(layout)/wishlist/Skeleton";
import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import WishlistComponent from "@/app/(main)/mypage/_components/Wishlist";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import { getWishlist, getUser } from "@/lib";
import { Product, BookmarkListRes, ResData } from "@/types";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "관심 상품",
  description: "9DOG 관심 상품 목록 페이지입니다.",
};

interface BookmarkItem {
  _id: number;
  product: Product;
  user_id: number;
  createdAt: string;
}

export async function generateWishlist({
  params,
}: {
  params: Promise<{ path: string; name: string; orderdate: string; price: string }>;
}): Promise<Metadata | undefined> {
  return;
}

interface Props {
  searchParams: Promise<{ page?: string }>;
  token: string;
}

export async function Wishlist({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";
  let userName = "회원";

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = Buffer.from(payloadBase64, "base64").toString("utf-8");
      const payload = JSON.parse(decodedPayload);
      const userId = payload._id || payload.id;

      const userRes = await getUser(userId);
      if (userRes && "item" in userRes) {
        userName = userRes.item.name;
      }
    } catch (error) {
      console.error("유저 정보를 불러오는 데 실패했습니다.", error);
    }
  }

  const response: ResData<BookmarkListRes> = await getWishlist(token, {
    page: currentPage,
    limit: 4,
  });

  const wishlistItems = (response?.ok === 1 ? response.item : []) as unknown as BookmarkItem[];
  const totalPages = (response?.ok === 1 && response?.pagination?.totalPages) || 1;

  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,240px)] gap-4 max-w-6xl mx-auto justify-center">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item: BookmarkItem) => (
            <li key={item._id} className="w-full max-w-[280px]">
              <WishlistComponent Product={item.product} bookmarkId={item._id} token={token} />
            </li>
          ))
        ) : (
          <li className="col-span-full py-20 text-center text-[#909094]">
            <p role="status">저장된 관심 상품이 없습니다.</p>
          </li>
        )}
      </ul>

      <nav className="flex justify-center mt-[100px]">
        <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />
      </nav>
    </>
  );
}

export default async function WishlistMain({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";

  let userName = "회원";
  if (token) {
    try {
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      const userRes = await getUser(payload._id || payload.id);
      if (userRes && "item" in userRes) userName = userRes.item.name;
    } catch (e) {}
  }

  return (
    <main className="w-full pb-[70px]">
      <div className="mt-[108px]">
        <h1 className="text-[#1A1A1C] text-center text-[26px] font-[900]">
          {userName}님이 저장한 <span className="text-[#FBA613]">관심 상품</span> 목록입니다
        </h1>
      </div>

      <div className="max-w-[1280px] lg:pl-[30px] lg:pr-[30px] pr-[10px] pl-[10px]  mx-auto pt-[57px] pb-[100px] px-[20px] lg:px-0">
        <Suspense
          fallback={
            <div role="status" aria-live="polite" aria-label="로딩 중">
              <ul className="grid grid-cols-[repeat(auto-fill,240px)] gap-4 max-w-6xl mx-auto justify-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="w-full max-w-[280px]">
                    <ProductCardSkeleton />
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <Wishlist searchParams={searchParams} token={token} />
        </Suspense>
      </div>
    </main>
  );
}
