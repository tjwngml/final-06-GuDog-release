"use client";

import Contentdetail from "@/app/(main)/mypage/_components/Contentdetail";
import { useParams, useSearchParams } from "next/navigation";
import { PlusIcon, PrevIcon } from "@/app/(main)/mypage/_components/Icons";
import StarComponent from "@/app/(main)/mypage/_components/StarComponent";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  uploadFile,
  createReview,
} from "@/app/(main)/mypage/(no-layout)/order/[orderid]/review/PostReview";
import MyReviewList from "@/app/(main)/mypage/_components/ReviewItem";
import { getOrders, showWarning, showSuccess, showError } from "@/lib";
import useUserStore from "@/zustand/useStore";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Order, OrderListRes, OrderProduct, ResData } from "@/types";

export default function Review() {
  const user = useUserStore((state) => state.user);

  const userName = user?.name || "회원";

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const order_id = Number(params.orderid);
  // const product_id = searchParams.get("productid");
  const product_id = Number(searchParams.get("productid"));

  const [preview, setPreview] = useState("/images/galary.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reviewContent, setReviewContent] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5); // 기본 별점 5점
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_LEN = 100;

  const token = Cookies.get("accessToken");
  const product_id_str = String(searchParams.get("productid"));
  const { data: resOrderlist, isLoading } = useQuery<ResData<OrderListRes>>({
    queryKey: ["order", order_id],
    queryFn: () =>
      getOrders(token ?? "", {
        custom: { _id: order_id },
        type: "user",
      }),
    enabled: !!order_id && !!token,
  });

  const orderData = resOrderlist?.ok === 1 ? resOrderlist.item : [];
  const currentOrder = orderData.find((o) => o._id === order_id);

  const targetProduct = currentOrder?.products.find((p) => String(p._id) === product_id_str);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    if (preview && preview !== "/images/galary.png") {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview("/images/galary.png");
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showWarning("만족도를 선택해 주세요.");
      return;
    }
    if (!reviewContent.trim()) {
      showWarning("후기 내용을 입력해 주세요.");
      return;
    }

    if (!order_id || !product_id) {
      showWarning("주문 정보를 확인할 수 없습니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      let attachedImage = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("attach", selectedFile);
        attachedImage = await uploadFile(formData);
      }

      await createReview({
        order_id: order_id,
        product_id: product_id,
        rating: rating,
        content: reviewContent,
        extra: {
          title: title,
          image: attachedImage,
        },
      });

      showSuccess("소중한 후기가 등록되었습니다!");
      router.push("/mypage/order");
    } catch (error) {
      showError("리뷰 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-[360px] bg-[#F9F9F9] lg:bg-transparent">
      <div className="pt-[70px] pb-[112px] px-[20px] max-w-[1280px] mx-auto lg:px-0 flex flex-col items-center">
        <div className="w-full max-w-[632px]">
          <Link className="flex flex-row gap-[7px] mb-[35px]" href={"/mypage/order"}>
            <PrevIcon className="w-[17.5px] h-[17.5px] text-[#909094]" />
            <p className="text-[#909094] text-[11.7px] font-black">뒤로가기</p>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-[14px]">
          <Badge variant="accent">{"MANAGE PLAN"}</Badge>
          <h1 className="text-[#1A1A1C] text-center text-[29.5px] font-black ">
            소중한 후기를 들려주세요
          </h1>
          <p className="text-[#646468] text-center text-[14.7px] font-medium  pb-[35px] break-keep">
            작성해주신 후기는 다른 견주님들께 큰 도움이 됩니다.
          </p>
        </div>

        <div className="w-full max-w-[632px] mb-[35px]">
          {isLoading ? (
            <p>로딩 중...</p>
          ) : currentOrder && targetProduct ? (
            <MyReviewList
              image={targetProduct?.image?.path || preview}
              name={targetProduct?.name || ""}
              price={targetProduct?.price.toLocaleString() + "원"}
              date={currentOrder.createdAt.split(" ")[0]}
              state={"배송중"}
            />
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#909094] text-[18px] font-medium">
                주문 정보를 불러올 수 없습니다.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white w-full max-w-[632px] rounded-[35px] flex flex-col items-center p-[20px] lg:p-[40px] shadow-sm">
          <div className="pb-[10px]">
            <StarComponent rating={rating} setRating={setRating} />
          </div>

          <div className="w-full max-w-[532px] mt-8">
            <p className="text-[#1A1A1C] font-inter text-[11.5px] font-black mb-[8px]">리뷰 제목</p>
            <Input
              className="w-full mb-[35px]"
              label=""
              placeholder="제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <Contentdetail
            className="w-full max-w-[532px]"
            label="상세 내용"
            placeholder="아이의 반응이나 제품에 대한 솔직한 후기를 남겨주세요 (최대 100자)"
            currentLength={reviewContent.length}
            maxLength={MAX_LEN}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />

          {/* 사진 업로드 영역 */}
          <div className="flex flex-col items-start w-full max-w-[532px] mt-[35px]">
            <p className="text-[#1A1A1C] text-[11.5px] font-black pb-[14px]">사진 첨부</p>
            <div className="flex flex-row items-center gap-4">
              <div className="relative w-[84px] h-[84px]">
                <img
                  className="w-full h-full object-cover border-2 rounded-[14px] border-[#909094] shadow-md"
                  src={preview}
                  alt="미리보기"
                />

                {selectedFile && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                    title="이미지 삭제"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* 업로드 버튼 */}
              <label className="cursor-pointer flex flex-col items-center justify-center w-[84px] h-[84px] border-2 border-dashed border-[#909094] rounded-[14px] bg-[#F9F9F9] hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <PlusIcon className="text-[#909094] w-[21px] h-[21px]" />
                <p className="text-[#909094] text-[12px] font-black">추가</p>
              </label>
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="w-full max-w-[532px] mt-[50px] pb-[20px]">
            <div className="flex flex-col lg:flex-row gap-[14px]">
              <Button
                className="flex-1"
                size="md"
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "후기 저장하기"}
              </Button>
              <Button className="flex-1" size="md" variant="outline" onClick={() => router.back()}>
                작성 취소
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
