"use client";

import { Product } from "@/types";
import Link from "next/link";
import { TrashIcon } from "@/app/(main)/mypage/_components/Icons";
import Image from "next/image";
import { deleteWishlist, showDeleteConfirm, showError } from "@/lib";
import { useRouter } from "next/navigation";
import { ProductCardSkeleton } from "@/app/(main)/mypage/(layout)/wishlist/Skeleton";
import { Product404 } from "@/app/(main)/mypage/_components/DogFoodImage";

interface WishlistComponentProps {
  bookmarkId: number;
  Product: Product;
  token: string;
}

export default function WishlistComponent({ bookmarkId, Product, token }: WishlistComponentProps) {
  const router = useRouter();
  const imagePath =
    Product.mainImages && Product.mainImages.length > 0 ? Product.mainImages[0].path : null;

  const handleDelete = async () => {
    const result = await showDeleteConfirm("관심 상품에서 삭제하시겠습니까?");
    if (!result.isConfirmed) return;

    try {
      const res = await deleteWishlist(token, bookmarkId);

      if (res.ok === 1) {
        router.refresh();
      } else {
        showError(res.message || "삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      showError("삭제 도중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="rounded-[42px] border border-[rgba(0,0,0,0.06)] bg-[#FFFFFF] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="pt-[30px] pl-[30px] pr-[30px] w-full  h-auto   overflow-hidden relative ">
          {imagePath ? (
            <Image
              src={imagePath}
              className="object-cover rounded-[24px]"
              alt="상품 이미지"
              width={211}
              height={211}
            />
          ) : (
            <div className="w-[211px] h-[211px] relative rounded-[24px] overflow-hidden bg-gray-50">
              <Product404 className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-[27px] px-[29px] pb-[14.5px]">
          <div className="text-[#1A1A1C] text-[18px] font-black truncate mr-2">{Product.name}</div>

          <button
            type="button"
            onClick={handleDelete}
            className="hover:scale-110 transition-transform active:opacity-70"
          >
            <TrashIcon className="text-[#909094] hover:text-red-500 transition-colors" />
          </button>
        </div>

        <hr className="w-[calc(100%-58px)] h-px mx-auto border-0 bg-[rgba(0,0,0,0.06)] " />
        <div className="pb-[36px] pt-[15px] flex pl-[29px] justify-between pr-[29px] ">
          <p className="text-[#1A1A1C] text-[12px] font-black">판매 가격</p>
          <p className="text-[#FBA613] text-[12px] font-black ">
            {Product.price.toLocaleString()}원
          </p>
        </div>

        <Link
          className="pt-[20px] flex flex-row pl-[29px] justify-center gap-[12px]"
          href={`/products/${Product._id}`}
        ></Link>
      </div>
    </>
  );
}
