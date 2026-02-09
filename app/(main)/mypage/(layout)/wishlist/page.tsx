import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";
import WishlistComponent from "@/app/(main)/mypage/_components/wishlist";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import { getWishlist } from "@/lib/bookmark";
import { getUser } from "@/lib/user";
import { Product } from "@/types/product";
import { BookmarkListRes, ResData } from "@/types/response";
import { Metadata } from "next";
import { cookies } from "next/headers";

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
}

export default async function Wishlist({ searchParams }: Props) {
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
    <div className="w-full pb-[70px]">
      <div className="mt-[108px]">
        <p className="text-[#1A1A1C] text-center text-[26.3px] font-[900]">{userName}님이 저장한</p>
        <div className="flex flex-row justify-center">
          <p className="text-[#FBA613] text-center text-[26.3px] font-[900]">관심 상품</p>
          <p className="text-[#1A1A1C] text-center text-[26.3px] font-[900]">목록입니다</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-[57px] pb-[100px] px-[20px] lg:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 lg:gap-x-7 gap-y-10 justify-items-center max-w-[500px] md:max-w-[700px] lg:max-w-none mx-auto">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item: BookmarkItem) => (
              <div key={item._id} className="w-full max-w-[280px]">
                <WishlistComponent Product={item.product} bookmarkId={item._id} token={token} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-[#909094]">
              저장된 관심 상품이 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
