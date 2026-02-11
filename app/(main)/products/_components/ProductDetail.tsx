"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/common/Button";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import PurchaseModal from "@/app/(main)/products/_components/Modal";
import { Product, Review, Post } from "@/types";
import Cookies from "js-cookie";
import useUserStore from "@/zustand/useStore";
import { addBookmark, getWishlist, deleteWishlist, showWarning } from "@/lib";
import StarRating from "@/components/common/StarRating";

interface Props {
  product: Product;
  productId: number;
  reviews: Review[];
  qna: Post[];
  reviewCount: number;
  qnaCount: number;
  currentReviewPage: number;
  currentQnaPage: number;
  reviewTotalPages: number;
  qnaTotalPages: number;
  reviewFilter: string;
}

export default function ProductDetail({
  product,
  productId,
  reviews,
  qna,
  reviewCount,
  qnaCount,
  currentReviewPage,
  currentQnaPage,
  reviewTotalPages,
  qnaTotalPages,
  reviewFilter,
}: Props) {
  // 최신순, 사진후기만 필터링
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleReviewFilter = (filter: "latest" | "photo") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("reviewFilter", filter);
    params.set("reviewPage", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const [isLiked, setIsLiked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const user = useUserStore((state) => state.user);
  const token = user?.token?.accessToken || Cookies.get("accessToken");

  // 페이지 로드 시 이 상품이 북마크되어 있는지 확인
  useEffect(() => {
    const checkBookmark = async () => {
      if (!token) return;
      const data = await getWishlist(token);
      if (data.ok === 1) {
        const found = data.item.find((b) => b.product?._id === productId);
        if (found) {
          setIsLiked(true);
          setBookmarkId(found._id);
        }
      }
    };
    checkBookmark();
  }, [user, productId]);

  // 하트 클릭
  const handleToggleBookmark = async () => {
    if (!token) {
      showWarning("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (isLiked && bookmarkId) {
      const res = await deleteWishlist(token, bookmarkId);
      if (res.ok === 1) {
        setIsLiked(false);
        setBookmarkId(null);
      }
    } else {
      const res = await addBookmark(token, productId);
      if (res.ok === 1) {
        setIsLiked(true);
        setBookmarkId(res.item._id);
      } else {
        const bookmarks = await getWishlist(token);
        if (bookmarks.ok === 1) {
          const existing = bookmarks.item.find((b) => b.product?._id === productId);
          if (existing) {
            setIsLiked(true);
            setBookmarkId(existing._id);
          }
        }
      }
    }
  };

  const [activeTab, setActiveTab] = useState<"detail" | "review" | "qna">("detail");
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [openQnaId, setOpenQnaId] = useState<number | null>(null);

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="mx-auto w-full min-w-[360px] max-w-300 items-center px-4 pb-35 pt-17.5 sm:px-5">
      <section
        aria-labelledby="product-title"
        className="mx-auto max-w-300 px-2 pb-21 pt-10.5 sm:px-5"
      >
        <Link
          href="/products"
          className="mb-7 inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent font-semibold text-[#8b8b8f]"
        >
          ‹ 목록으로
        </Link>

        {/* 상품이미지 */}
        <div className="mx-auto flex max-w-[75rem] flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-14">
          <div className="image-card w-full max-w-[538px] flex-shrink-0">
            <Image
              className="block w-full rounded-4xl object-cover"
              src={product.mainImages[0]?.path || "images/product-404.jpg"}
              width={538}
              height={552}
              alt={product.name}
            />
          </div>

          <div className="flex w-full flex-col items-start lg:max-w-[34rem]">
            {product.extra?.type === "사료" && (
              <span className="flex items-center rounded-[0.4375rem] border border-[rgba(251,166,19,0.2)] bg-[#fff5e6] px-[0.65625rem] py-[0.21875rem] text-[0.625rem] font-extrabold uppercase leading-[0.9375rem] tracking-[0.03125rem] text-[#fba613]">
                {product.extra?.lifeStage?.[0] || ""}
              </span>
            )}
            <div>
              <h1
                id="product-title"
                className="mb-6 text-2xl font-bold sm:mb-12.5 sm:text-[2.625rem]"
              >
                {product.name}
              </h1>
            </div>

            {/* 정보카드 */}
            <div className="mb-8.75 flex w-full flex-col items-start self-stretch rounded-[2.1875rem] bg-bg-secondary p-4 sm:p-7">
              <dl className="w-full">
                <div className="flex min-h-[1.5625rem] w-full items-center justify-between self-stretch py-4 sm:py-7">
                  <dt className="font-medium">판매가격</dt>
                  <dd className="text-xl font-bold sm:text-[1.625rem]">
                    {product.price.toLocaleString("ko-KR")}원
                  </dd>
                </div>

                <div className="my-[0.625rem] h-px bg-black/[0.06]" />

                <div className="mt-[1.3125rem] flex min-h-[1.5625rem] w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-[#8b8b8f]">배송정보</dt>
                  <dd className="text-sm text-[#3a3a3c] sm:text-base">
                    무료배송 [9Dog 정기구독 시 10% 할인]
                  </dd>
                </div>
                <div className="mt-[1.3125rem] flex min-h-[1.5625rem] w-full items-center justify-between self-stretch">
                  <dt className="text-sm text-[#8b8b8f]">상품 정보</dt>
                  <dd className="text-[#3a3a3c]">{product.extra?.weight}g</dd>
                </div>
              </dl>
            </div>

            <p className="pb-[2.63281rem] font-['Abhaya_Libre_Medium'] text-sm font-medium leading-[1.42188rem] text-[#646468]">
              {product.extra?.content}
            </p>

            {/* 구매하기 버튼 */}
            <div className="flex w-full flex-row items-start gap-3.5">
              <button
                className={`flex h-[3.25rem] flex-1 items-center justify-center rounded-[0.875rem] px-4 py-[1.09375rem] sm:px-[1.3125rem] ${
                  product.quantity - product.buyQuantity <= 0
                    ? "cursor-not-allowed bg-[#d1d1d6] text-white"
                    : "bg-[#fba613] text-white shadow-[0_0.5rem_2rem_0_rgba(251,166,19,0.2)]"
                }`}
                type="button"
                disabled={product.quantity - product.buyQuantity <= 0}
                onClick={() => setIsModalOpen(true)}
              >
                {product.quantity - product.buyQuantity <= 0 ? "Sold Out" : "구매하기"}
              </button>

              {/* 관심상품 버튼 */}
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleToggleBookmark}
                aria-label={isLiked ? "관심상품에서 제거" : "관심상품에 추가"}
                aria-pressed={isLiked}
              >
                <svg
                  width="81"
                  height="53"
                  viewBox="0 0 81 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect width="81" height="52.5" rx="14" fill="white" />
                  <rect
                    x="1"
                    y="1"
                    width="79"
                    height="50.5"
                    rx="13"
                    stroke="black"
                    strokeOpacity="0.1"
                    strokeWidth="2"
                  />
                  <path
                    d="M33.7783 21.2783C33.4126 21.6439 33.1226 22.078 32.9247 22.5557C32.7268 23.0334 32.625 23.5455 32.625 24.0625C32.625 24.5796 32.7268 25.0916 32.9247 25.5694C33.1226 26.0471 33.4126 26.4812 33.7783 26.8468L40.5 33.5685L47.2218 26.8468C47.9602 26.1084 48.3751 25.1068 48.3751 24.0625C48.3751 23.0182 47.9602 22.0167 47.2218 21.2783C46.4834 20.5399 45.4818 20.125 44.4375 20.125C43.3932 20.125 42.3917 20.5399 41.6533 21.2783L40.5 22.4315L39.3468 21.2783C38.9812 20.9126 38.5471 20.6226 38.0694 20.4247C37.5916 20.2268 37.0796 20.125 36.5625 20.125C36.0455 20.125 35.5334 20.2268 35.0557 20.4247C34.578 20.6226 34.1439 20.9126 33.7783 21.2783Z"
                    fill={isLiked ? "#FF3B30" : "none"}
                    stroke={isLiked ? "#FF3B30" : "#1A1A1C"}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 메뉴 이동 버튼 */}
      <nav className="mx-auto flex w-full max-w-[75rem] flex-col items-center border-y border-black/[0.06] bg-white/95 px-2 backdrop-blur-[12px] sm:px-5">
        <div
          className="flex w-full max-w-[75rem] items-start justify-center self-stretch px-0 sm:px-5"
          role="tablist"
        >
          {[
            { key: "detail" as const, value: "상세정보" },
            { key: "review" as const, value: `리뷰 (${reviewCount})` },
            { key: "qna" as const, value: `Q&A (${qnaCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                const el = document.getElementById(tab.key);
                if (el) {
                  const header = document.querySelector("header");
                  const headerHeight = header?.offsetHeight ?? 0;
                  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-[1.09375rem] text-center text-[0.65rem] leading-[1.09375rem] transition-colors sm:px-[2.625rem] sm:text-[0.76875rem] ${
                activeTab === tab.key
                  ? "font-black text-[#fba613]"
                  : "font-bold text-[#909094] hover:text-[#fba613]"
              }`}
            >
              {tab.value}
              {activeTab === tab.key && (
                <div
                  className="absolute bottom-0 h-[0.21875rem] w-[5rem] rounded-[624.9375rem] bg-[#fba613] sm:w-[7.9375rem]"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* 상세정보 */}
      <section id="detail" role="tabpanel" aria-labelledby="상세정보" className="w-full">
        <div
          className={`relative overflow-hidden transition-all duration-500 ${
            isDetailExpanded ? "max-h-none" : "max-h-[400px]"
          }`}
        >
          {product.extra?.detailImages && product.extra.detailImages.length > 0 ? (
            product.extra.detailImages.map((img, idx) => (
              <Image
                key={idx}
                src={img.path}
                width={1200}
                height={800}
                alt={img.name || `상품 상세 이미지 ${idx + 1}`}
                className="h-auto w-full"
              />
            ))
          ) : (
            <>
              <Image
                src="/images/image-27.png"
                width={1200}
                height={800}
                alt="상품 상세 이미지 1"
                className="h-auto w-full"
              />
              <Image
                src="/images/image-28.png"
                width={1200}
                height={800}
                alt="상품 상세 이미지 2"
                className="h-auto w-full"
              />
            </>
          )}
          {!isDetailExpanded && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        {/* 상세 더보기 */}
        <button
          type="button"
          onClick={() => setIsDetailExpanded(!isDetailExpanded)}
          aria-expanded={isDetailExpanded}
          aria-label={isDetailExpanded ? "상세 정보 접기" : "상세 정보 더보기"}
          className="flex w-full cursor-pointer items-center justify-center self-stretch border-y border-black/[0.06] bg-white/95 px-[2.625rem] py-[1.09375rem] backdrop-blur-[12px]"
        >
          <span className="flex items-center gap-1 text-center text-[0.8125rem] font-bold leading-[17.5px] text-gray-600">
            {isDetailExpanded ? "상세 접기" : "상세 더보기"}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isDetailExpanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path
                d="M4.5 6.75L9 11.25L13.5 6.75"
                stroke="#909094"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </section>

      {/* 리뷰 */}
      <section
        id="review"
        role="tabpanel"
        aria-labelledby="review-heading"
        className="mt-[4rem] flex flex-col gap-4 border-b border-black/[0.06] pb-[2.1875rem] sm:mt-[7rem] sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex w-full flex-col items-start justify-end gap-[0.4375rem] pt-[2.375rem] sm:w-auto">
          <h2
            id="review-heading"
            className="text-xl font-black leading-[2.1875rem] tracking-[-0.09844rem] text-[#1a1a1c] sm:text-[1.96875rem]"
          >
            구매 견주님들의 솔직 후기
          </h2>
          <div className="flex items-center">
            <span className="text-xl font-black leading-[2.1875rem] text-[#fba613] sm:text-[1.96875rem]">
              {reviews.length > 0
                ? (reviews.reduce((sum, re) => sum + re.rating, 0) / reviews.length).toFixed(1)
                : "0.0"}
            </span>
            <span className="flex flex-col items-start pl-[10.5px] text-sm font-bold leading-[1.3125rem] text-[#909094]">
              / 5.0
            </span>
            <div className="pl-2">
              <StarRating
                rating={
                  reviews.length > 0
                    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                    : 0
                }
                size={18}
              />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-[0.4375rem]" role="group">
          <Button
            variant={reviewFilter === "latest" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleReviewFilter("latest")}
            aria-pressed={reviewFilter === "latest"}
          >
            최신순
          </Button>
          <Button
            variant={reviewFilter === "photo" ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleReviewFilter("photo")}
            aria-pressed={reviewFilter === "photo"}
          >
            사진후기만
          </Button>
        </div>
      </section>

      <section aria-label="리뷰 목록" className="mt-[1.75rem]">
        {reviews.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-[#909094]" role="status">
            등록된 리뷰가 없습니다.
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review._id}
              className="mt-6 rounded-[1.5rem] border border-black/[0.06] bg-white p-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] sm:mt-10 sm:rounded-[2.1875rem] sm:p-7"
            >
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
                <div className="h-24 w-24 flex-shrink-0 sm:h-[8.75rem] sm:w-[8.75rem]">
                  <Image
                    src={review.extra?.image?.path || "/images/product-404.jpg"}
                    className="block h-full w-full rounded-[1.125rem] object-cover"
                    width={140}
                    height={140}
                    alt="리뷰 상품 이미지"
                  />
                </div>

                <div className="w-full flex-1">
                  <div className="flex flex-wrap items-start gap-2 sm:gap-3">
                    <div className="flex flex-col gap-1 hover:opacity-80">
                      <StarRating rating={review.rating} />
                      <p className="text-sm sm:text-base">{review.extra?.title}</p>
                      <p className="text-xs text-gray-500 sm:text-sm">
                        {review.user.name} | {review.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-[0.625rem] text-xs font-medium leading-[1.42188rem] text-[#646468] sm:text-sm">
                    <p>{review.content}</p>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* 리뷰 페이지네이션 */}
      <PaginationWrapper
        currentPage={currentReviewPage}
        totalPages={reviewTotalPages}
        paramKey="reviewPage"
        scrollTop={false}
      />

      {/* QnA */}
      <div className="mx-auto mt-14 flex max-w-[75rem] flex-col gap-2.5 sm:mt-28">
        <section className="flex flex-col gap-4 border-b border-black/[0.06] pb-5 sm:flex-row sm:justify-between sm:gap-6">
          <div id="qna" className="flex flex-col items-start gap-2">
            <span className="inline-flex h-7 w-fit items-center justify-center">
              <svg
                width="46"
                height="24"
                viewBox="0 0 46 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="46" height="24" rx="7" fill="#F0F0F3" />
                <rect
                  x="0.5"
                  y="0.5"
                  width="45"
                  height="23"
                  rx="6.5"
                  stroke="black"
                  strokeOpacity="0.06"
                />
                <path
                  d="M14.7324 12.9805H16.0898L16.5488 13.5469C16.8174 13.1904 16.9688 12.6533 16.9688 11.9648C16.9688 10.5586 16.3438 9.79688 15.3086 9.79688C14.2734 9.79688 13.6484 10.5586 13.6484 11.9648C13.6484 13.3711 14.2734 14.1328 15.3086 14.1328C15.4062 14.1328 15.5039 14.1279 15.6016 14.1133L14.7324 12.9805ZM18.668 11.9648C18.668 13.21 18.2529 14.1572 17.5742 14.7773L18.6094 16.0566H17.0957L16.5488 15.3926C16.168 15.5293 15.748 15.5977 15.3086 15.5977C13.4043 15.5977 11.9492 14.2891 11.9492 11.9648C11.9492 9.63086 13.4043 8.33203 15.3086 8.33203C17.2031 8.33203 18.668 9.63086 18.668 11.9648ZM22.3711 15.6074C20.877 15.6074 19.9688 14.7285 19.9688 13.625C19.9688 12.8096 20.4814 12.3213 21.2383 11.8086C20.8916 11.3594 20.6035 10.8271 20.6035 10.207C20.6035 9.15234 21.3945 8.33203 22.5859 8.33203C23.748 8.33203 24.4609 9.11328 24.4609 10.0508C24.4609 10.7148 24.1191 11.2617 23.5137 11.6914L23.1328 11.9648L24.1973 13.166C24.3828 12.8193 24.5 12.4092 24.5 11.9551H25.8379C25.8379 12.8975 25.6035 13.6982 25.1738 14.2695L26.2578 15.5H24.5781L24.1777 15.0605C23.6406 15.4463 22.9814 15.6074 22.3711 15.6074ZM21.5605 13.5176C21.5605 13.9766 21.9121 14.2988 22.4688 14.2988C22.7422 14.2988 23.0205 14.2207 23.2793 14.084L22.0586 12.7461C21.7412 12.9756 21.5605 13.2295 21.5605 13.5176ZM21.9707 10.2266C21.9707 10.4951 22.1318 10.7637 22.3711 11.0664L22.7129 10.8516C23.0547 10.6367 23.1914 10.4023 23.1914 10.1484C23.1914 9.89453 22.9766 9.64062 22.5957 9.64062C22.2148 9.64062 21.9707 9.89453 21.9707 10.2266ZM28.7402 15.5H26.9434L29.3457 8.42969H31.5527L33.9453 15.5H32.1582L31.6797 13.9863H29.2188L28.7402 15.5ZM29.6191 12.7168H31.2793L30.4785 10.1777H30.4199L29.6191 12.7168Z"
                  fill="#646468"
                />
              </svg>
            </span>
            <h2 className="m-0 text-xl font-black tracking-[-0.02em] sm:text-[2.5rem]">
              궁금한 점을 물어 보세요.
            </h2>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="h-11 w-fit self-start whitespace-nowrap rounded-[0.875rem] border-0 bg-[#fba613] px-[1.125rem] text-center text-[0.76875rem] font-bold leading-[1.09375rem] text-white shadow-[0_8px_32px_rgba(251,166,19,0.2)] sm:self-end"
            onClick={() => {
              const params = new URLSearchParams();
              params.set("productName", product.name);
              params.set("productImage", product.mainImages[0]?.path || "");
              router.push(`/products/${productId}/qna?${params.toString()}`);
            }}
          >
            문의 작성하기
          </Button>
        </section>

        <div className="flex flex-col">
          {qna.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-[#909094]">
              등록된 Q&A가 없습니다.
            </div>
          ) : (
            qna.map((item) => (
              <section
                key={item._id}
                className="border-b border-black/[0.06]"
                onClick={() => setOpenQnaId(openQnaId === item._id ? null : item._id)}
              >
                <button
                  type="button"
                  className="relative flex w-full flex-col gap-2 border-0 bg-transparent py-4 pr-8 text-left text-inherit sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-[18px] sm:py-[26px] sm:pr-0"
                >
                  <span
                    className={`inline-flex h-7 w-fit items-center justify-center whitespace-nowrap rounded-[6.5px] border px-3 text-xs font-bold ${
                      item.replies && item.replies.length > 0
                        ? "border-[#F0FDF4] bg-[#DCFCE7] text-[#16A34A]"
                        : "border-[#E4E4E7] bg-[#F0F0F3] text-[#646468]"
                    }`}
                  >
                    {item.replies && item.replies.length > 0 ? "답변완료" : "답변대기"}
                  </span>
                  <p className="m-0 text-sm font-extrabold tracking-[-0.01em] sm:text-lg">
                    {item.title}
                  </p>
                  <p className="m-0 whitespace-nowrap text-xs font-semibold text-[#909094] sm:text-sm">
                    {item.user.name} | {item.createdAt.slice(0, 20)}
                  </p>
                  <span
                    className={`absolute right-0 top-1/2 -translate-y-1/2 text-lg leading-none text-[#909094] origin-center sm:static sm:translate-y-0 ${openQnaId === item._id ? "rotate-180" : ""}`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.8529 6.5625L8.7487 11.6667L3.6445 6.5625"
                        stroke="#909094"
                        strokeWidth="2.1875"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* 아코디언 답변 */}
                <div
                  className={`flex flex-col bg-gray-100 ${openQnaId === item._id ? "px-7 py-7" : "hidden px-0 py-0"}`}
                >
                  <div className="rounded-xl bg-gray-200 p-8">
                    <p className="text-sm text-[black]">{item.content}</p>
                  </div>
                  {item.replies && item.replies.length > 0 && (
                    <div className="mt-6 ml-8 flex">
                      {/* ㄴ자 연결선 */}
                      <div className="mr-2 mt-1 h-6 w-4 border-b border-l border-[#d1d1d6]" />
                      <div className="flex-1 flex items-start gap-3 rounded-xl bg-gray-200 p-4">
                        <div className="flex-shrink-0 self-start">
                          <svg
                            width="45"
                            height="45"
                            viewBox="0 0 66 66"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g filter="url(#filter0_d_131_30784)">
                              <rect
                                x="12"
                                y="10"
                                width="42"
                                height="42"
                                rx="14"
                                fill="white"
                                shapeRendering="crispEdges"
                              />
                              <circle
                                cx="33"
                                cy="31"
                                r="7.875"
                                stroke="#FBA613"
                                strokeWidth="2.1875"
                              />
                              <text
                                x="33"
                                y="31"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#FBA613"
                                fontSize="12"
                                fontWeight="bold"
                              >
                                A
                              </text>
                            </g>
                            <defs>
                              <filter
                                id="filter0_d_131_30784"
                                x="0"
                                y="0"
                                width="66"
                                height="66"
                                filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB"
                              >
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feOffset dy="2" />
                                <feGaussianBlur stdDeviation="6" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="BackgroundImageFix"
                                  result="effect1_dropShadow_131_30784"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="effect1_dropShadow_131_30784"
                                  result="shape"
                                />
                              </filter>
                            </defs>
                          </svg>
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          {item.replies.map((reply) => (
                            <div key={reply._id} className="flex flex-col gap-2">
                              <p className="whitespace-pre-wrap text-sm text-[black]">
                                {reply.content}
                              </p>
                              <p className="self-end text-xs text-[#808084]">
                                {reply.createdAt.slice(0, 20)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* QnA 페이지네이션 */}
      <PaginationWrapper
        currentPage={currentQnaPage}
        totalPages={qnaTotalPages}
        paramKey="qnaPage"
        scrollTop={false}
      />

      {/* 구매 모달 */}
      <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />
    </main>
  );
}
