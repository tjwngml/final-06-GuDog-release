"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/common/Button";
import PaginationWrapper from "@/components/common/PaginationWrapper";
import PurchaseModal from "@/app/(main)/products/_components/Modal";

interface Props {
  productId: string;
  currentReviewPage: number;
  currentQnaPage: number;
  reviewTotalPages: number;
  qnaTotalPages: number;
}

export default function ProductDetail({
  productId,
  currentReviewPage,
  currentQnaPage,
  reviewTotalPages,
  qnaTotalPages,
}: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"detail" | "review" | "qna">("detail");
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [openQnaId, setOpenQnaId] = useState<number | null>(null);
  const [helpfulReview1, setHelpfulReview1] = useState(false);
  const [helpfulCount1, setHelpfulCount1] = useState(0);
  const [helpfulReview2, setHelpfulReview2] = useState(false);
  const [helpfulCount2, setHelpfulCount2] = useState(0);

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="mx-auto w-full min-w-[360px] max-w-300 items-center px-4 pb-35 pt-17.5 sm:px-5">
      <section className="mx-auto max-w-300 px-2 pb-21 pt-10.5 sm:px-5">
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
              src="/images/jointcare_chicken_brownrice.png"
              width={538}
              height={552}
              alt="어덜트 밸런스 치킨 상품 이미지"
            />
          </div>

          <div className="flex w-full flex-col items-start lg:max-w-[34rem]">
            <span className="flex items-center rounded-[0.4375rem] border border-[rgba(251,166,19,0.2)] bg-[#fff5e6] px-[0.65625rem] py-[0.21875rem] text-[0.625rem] font-extrabold uppercase leading-[0.9375rem] tracking-[0.03125rem] text-[#fba613]">
              ADULT
            </span>
            <div>
              <h1 className="mb-6 text-2xl font-bold sm:mb-12.5 sm:text-[2.625rem]">
                어덜트 밸런스 치킨
              </h1>
            </div>

            {/* 정보카드 */}
            <div className="mb-8.75 flex w-full flex-col items-start self-stretch rounded-[2.1875rem] bg-bg-secondary p-4 sm:p-7">
              <dl className="w-full">
                <div className="flex min-h-[1.5625rem] w-full items-center justify-between self-stretch py-4 sm:py-7">
                  <dt className="font-medium">판매가격</dt>
                  <dd className="text-xl font-bold sm:text-[1.625rem]">32,000원</dd>
                </div>

                <div className="my-[0.625rem] h-px bg-black/[0.06]" />

                <div className="mt-[1.3125rem] flex min-h-[1.5625rem] w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-[#8b8b8f]">배송정보</dt>
                  <dd className="text-sm text-[#3a3a3c] sm:text-base">
                    무료배송 [9Dog 정기구독 시]
                  </dd>
                </div>
                <div className="mt-[1.3125rem] flex min-h-[1.5625rem] w-full items-center justify-between self-stretch">
                  <dt className="text-sm text-[#8b8b8f]">상품 정보</dt>
                  <dd className="text-[#3a3a3c]">2KG</dd>
                </div>
              </dl>
            </div>

            <p className="pb-[2.63281rem] font-['Abhaya_Libre_Medium'] text-sm font-medium leading-[1.42188rem] text-[#646468]">
              가장 신선한 원재료로 아이의 입맛과 건강을 동시에 챙기세요.
              <br />
              인공 첨가물 없이 정직하게 만들었습니다.
            </p>

            {/* 구매하기 버튼 */}
            <div className="flex w-full flex-row items-start gap-3.5">
              <button
                className="flex h-[3.25rem] flex-1 items-center justify-center rounded-[0.875rem] bg-[#fba613] text-white px-4 py-[1.09375rem] shadow-[0_0.5rem_2rem_0_rgba(251,166,19,0.2)] sm:px-[1.3125rem]"
                type="button"
                onClick={() => setIsModalOpen(true)}
              >
                구매하기
              </button>
              {/* 관심상품 버튼 */}
              <button type="button" className="cursor-pointer" onClick={() => setIsLiked(!isLiked)}>
                <svg
                  width="81"
                  height="53"
                  viewBox="0 0 81 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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

      {/* 상세정보 */}
      <section id="detail" className="w-full">
        <div
          className={`relative overflow-hidden transition-all duration-500 ${
            isDetailExpanded ? "max-h-none" : "max-h-[400px]"
          }`}
        >
          <Image
            src="/images/image 27.png"
            width={1200}
            height={800}
            alt="상품 상세 이미지 1"
            className="h-auto w-full"
          />
          <Image
            src="/images/image 28.png"
            width={1200}
            height={800}
            alt="상품 상세 이미지 2"
            className="h-auto w-full"
          />
          {!isDetailExpanded && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        {/* 상세 더보기 */}
        <div className="flex items-center justify-center self-stretch border-y border-black/[0.06] bg-white/95 px-[2.625rem] py-[1.09375rem] backdrop-blur-[12px]">
          <button
            type="button"
            onClick={() => setIsDetailExpanded(!isDetailExpanded)}
            className="flex items-center gap-1 text-center text-[0.8125rem] font-bold leading-[17.5px] text-gray-600"
          >
            {isDetailExpanded ? "상세 접기" : "상세 더보기"}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isDetailExpanded ? "rotate-180" : ""}`}
            >
              <path
                d="M4.5 6.75L9 11.25L13.5 6.75"
                stroke="#909094"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* 리뷰 */}
      <section
        id="review"
        className="mt-[4rem] flex flex-col gap-4 border-b border-black/[0.06] pb-[2.1875rem] sm:mt-[7rem] sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex w-full flex-col items-start justify-end gap-[0.4375rem] pt-[2.375rem] sm:w-auto">
          <h2 className="text-xl font-black leading-[2.1875rem] tracking-[-0.09844rem] text-[#1a1a1c] sm:text-[1.96875rem]">
            구매 견주님들의 솔직 후기
          </h2>
          <div className="flex items-center">
            <span className="text-xl font-black leading-[2.1875rem] text-[#fba613] sm:text-[1.96875rem]">
              4.8
            </span>
            <span className="flex flex-col items-start pl-[10.5px] text-sm font-bold leading-[1.3125rem] text-[#909094]">
              / 5.0
            </span>
            <svg
              className="pl-2"
              width="310"
              height="18"
              viewBox="0 0 310 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.42955 10.7025L3.12741 13.0874L4.42905 9.20866L1.11818 6.81506H5.17159L6.42955 2.93636L7.6875 6.81506H11.7409L8.43004 9.20866L9.73168 13.0874L6.42955 10.7025Z"
                fill="#FBA613"
              />
              <path
                d="M22.9295 10.7025L19.6274 13.0874L20.929 9.20866L17.6182 6.81506H21.6716L22.9295 2.93636L24.1875 6.81506H28.2409L24.93 9.20866L26.2317 13.0874L22.9295 10.7025Z"
                fill="#FBA613"
              />
              <path
                d="M39.4295 10.7025L36.1274 13.0874L37.429 9.20866L34.1182 6.81506H38.1716L39.4295 2.93636L40.6875 6.81506H44.7409L41.43 9.20866L42.7317 13.0874L39.4295 10.7025Z"
                fill="#FBA613"
              />
              <path
                d="M55.9295 10.7025L52.6274 13.0874L53.929 9.20866L50.6182 6.81506H54.6716L55.9295 2.93636L57.1875 6.81506H61.2409L57.93 9.20866L59.2317 13.0874L55.9295 10.7025Z"
                fill="#FBA613"
              />
              <path
                d="M72.4295 10.7025L69.1274 13.0874L70.429 9.20866L67.1182 6.81506H71.1716L72.4295 2.93636L73.6875 6.81506H77.7409L74.43 9.20866L75.7317 13.0874L72.4295 10.7025Z"
                fill="#FBA613"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-start gap-[0.4375rem]">
          <Button variant="outline" size="sm">
            최신순
          </Button>
          <Button variant="secondary" size="sm">
            사진후기만
          </Button>
        </div>
      </section>

      <section className="mt-[1.75rem]">
        <article className="mt-6 rounded-[1.5rem] border border-black/[0.06] bg-white p-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] sm:mt-10 sm:rounded-[2.1875rem] sm:p-7">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
            <div className="h-24 w-24 flex-shrink-0 sm:h-[8.75rem] sm:w-[8.75rem]">
              <Image
                src="/images/jointcare_chicken_brownrice.png"
                className="block h-full w-full rounded-[1.125rem] object-cover"
                width={140}
                height={140}
                alt="리뷰 상품 이미지"
              />
            </div>

            <div className="w-full flex-1">
              <div className="flex flex-wrap items-start gap-2 sm:gap-3">
                <Link href="#" className="flex flex-col gap-1 hover:opacity-80">
                  <svg
                    width="310"
                    height="18"
                    viewBox="0 0 310 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.42955 10.7025L3.12741 13.0874L4.42905 9.20866L1.11818 6.81506H5.17159L6.42955 2.93636L7.6875 6.81506H11.7409L8.43004 9.20866L9.73168 13.0874L6.42955 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M22.9295 10.7025L19.6274 13.0874L20.929 9.20866L17.6182 6.81506H21.6716L22.9295 2.93636L24.1875 6.81506H28.2409L24.93 9.20866L26.2317 13.0874L22.9295 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M39.4295 10.7025L36.1274 13.0874L37.429 9.20866L34.1182 6.81506H38.1716L39.4295 2.93636L40.6875 6.81506H44.7409L41.43 9.20866L42.7317 13.0874L39.4295 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M55.9295 10.7025L52.6274 13.0874L53.929 9.20866L50.6182 6.81506H54.6716L55.9295 2.93636L57.1875 6.81506H61.2409L57.93 9.20866L59.2317 13.0874L55.9295 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M72.4295 10.7025L69.1274 13.0874L70.429 9.20866L67.1182 6.81506H71.1716L72.4295 2.93636L73.6875 6.81506H77.7409L74.43 9.20866L75.7317 13.0874L72.4295 10.7025Z"
                      fill="#FBA613"
                    />
                  </svg>

                  <p className="text-sm sm:text-base">우리 애가 너무 잘 먹어요!</p>
                  <p className="text-xs text-gray-500 sm:text-sm">견주사랑 | 2024.01.10</p>
                </Link>

                <div className="ml-auto self-start">
                  <button
                    type="button"
                    onClick={() => {
                      setHelpfulReview1(!helpfulReview1);
                      setHelpfulCount1(helpfulReview1 ? helpfulCount1 - 1 : helpfulCount1 + 1);
                    }}
                    className={`inline-flex items-center rounded-[0.5rem] border px-2 py-1 text-[11px] font-bold transition-colors ${
                      helpfulReview1
                        ? "border-[#fba613] bg-[#fff5e6] text-[#fba613]"
                        : "border-black/[0.06] bg-[#f5f5f7] text-[#646468]"
                    }`}
                  >
                    <svg
                      width="20"
                      height="14"
                      viewBox="0 0 20 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <svg clipPath="url(#clip0_131_26598)">
                        <path
                          d="M8.16667 5.83317H10.9416C11.251 5.83317 11.5477 5.95609 11.7665 6.17488C11.9853 6.39367 12.1082 6.69042 12.1082 6.99984C12.1082 7.30926 11.9853 7.606 11.7665 7.82479C11.5477 8.04359 11.251 8.1665 10.9416 8.1665H10.1716L10.535 10.0962C10.5661 10.2634 10.5603 10.4354 10.518 10.6002C10.4756 10.7649 10.3978 10.9185 10.2898 11.0499C10.1819 11.1814 10.0465 11.2877 9.8932 11.3614C9.73986 11.435 9.57227 11.4743 9.40217 11.4763H5.50083C5.23666 11.4759 4.98045 11.3858 4.77413 11.2208C4.56781 11.0558 4.4236 10.8257 4.36508 10.5681L3.5 5.90434V2.33317C3.5 2.02375 3.62292 1.72701 3.84171 1.50821C4.0605 1.28942 4.35725 1.1665 4.66667 1.1665H7.58333C7.89275 1.1665 8.1895 1.28942 8.40829 1.50821C8.62708 1.72701 8.75 2.02375 8.75 2.33317V5.83317H8.16667Z"
                          stroke="#646468"
                          strokeWidth="1.45833"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <defs>
                        <clipPath id="clip0_131_26598">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    도움돼요 {helpfulCount1}
                  </button>
                </div>
              </div>

              <div className="mt-[0.625rem] text-xs font-medium leading-[1.42188rem] text-[#646468] sm:text-sm">
                <p>
                  입맛이 까다로운 편인데 이건 봉지 소리만 들려도 달려와요.성분도 착해서 안심하고
                  먹입니다.벌써 세번째 구매예요.
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="mt-6 rounded-[1.5rem] border border-black/[0.06] bg-white p-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.03)] sm:mt-10 sm:rounded-[2.1875rem] sm:p-7">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
            <div className="w-full flex-1">
              <div className="flex flex-wrap items-start gap-2 sm:gap-3">
                <Link href="#" className="flex flex-col gap-1 hover:opacity-80">
                  <svg
                    width="310"
                    height="18"
                    viewBox="0 0 310 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.42955 10.7025L3.12741 13.0874L4.42905 9.20866L1.11818 6.81506H5.17159L6.42955 2.93636L7.6875 6.81506H11.7409L8.43004 9.20866L9.73168 13.0874L6.42955 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M22.9295 10.7025L19.6274 13.0874L20.929 9.20866L17.6182 6.81506H21.6716L22.9295 2.93636L24.1875 6.81506H28.2409L24.93 9.20866L26.2317 13.0874L22.9295 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M39.4295 10.7025L36.1274 13.0874L37.429 9.20866L34.1182 6.81506H38.1716L39.4295 2.93636L40.6875 6.81506H44.7409L41.43 9.20866L42.7317 13.0874L39.4295 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M55.9295 10.7025L52.6274 13.0874L53.929 9.20866L50.6182 6.81506H54.6716L55.9295 2.93636L57.1875 6.81506H61.2409L57.93 9.20866L59.2317 13.0874L55.9295 10.7025Z"
                      fill="#FBA613"
                    />
                    <path
                      d="M72.4295 10.7025L69.1274 13.0874L70.429 9.20866L67.1182 6.81506H71.1716L72.4295 2.93636L73.6875 6.81506H77.7409L74.43 9.20866L75.7317 13.0874L72.4295 10.7025Z"
                      fill="#FBA613"
                    />
                  </svg>
                  <p className="text-sm sm:text-base">변 상태가 좋아졌어요</p>
                  <p className="text-xs sm:text-sm">초코맘 | 2024.01.08</p>
                </Link>

                <div className="ml-auto self-start">
                  <button
                    type="button"
                    onClick={() => {
                      setHelpfulReview2(!helpfulReview2);
                      setHelpfulCount2(helpfulReview2 ? helpfulCount2 - 1 : helpfulCount2 + 1);
                    }}
                    className={`inline-flex items-center rounded-[0.5rem] border px-2 py-1 text-[11px] font-bold transition-colors ${
                      helpfulReview2
                        ? "border-[#fba613] bg-[#fff5e6] text-[#fba613]"
                        : "border-black/[0.06] bg-[#f5f5f7] text-[#646468]"
                    }`}
                  >
                    <svg
                      width="20"
                      height="14"
                      viewBox="0 0 20 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_131_26598)">
                        <path
                          d="M8.16667 5.83317H10.9416C11.251 5.83317 11.5477 5.95609 11.7665 6.17488C11.9853 6.39367 12.1082 6.69042 12.1082 6.99984C12.1082 7.30926 11.9853 7.606 11.7665 7.82479C11.5477 8.04359 11.251 8.1665 10.9416 8.1665H10.1716L10.535 10.0962C10.5661 10.2634 10.5603 10.4354 10.518 10.6002C10.4756 10.7649 10.3978 10.9185 10.2898 11.0499C10.1819 11.1814 10.0465 11.2877 9.8932 11.3614C9.73986 11.435 9.57227 11.4743 9.40217 11.4763H5.50083C5.23666 11.4759 4.98045 11.3858 4.77413 11.2208C4.56781 11.0558 4.4236 10.8257 4.36508 10.5681L3.5 5.90434V2.33317C3.5 2.02375 3.62292 1.72701 3.84171 1.50821C4.0605 1.28942 4.35725 1.1665 4.66667 1.1665H7.58333C7.89275 1.1665 8.1895 1.28942 8.40829 1.50821C8.62708 1.72701 8.75 2.02375 8.75 2.33317V5.83317H8.16667Z"
                          stroke="#646468"
                          stroke-width="1.45833"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_131_26598">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    도움돼요 {helpfulCount2}
                  </button>
                </div>
              </div>

              <div className="mt-[0.625rem] text-xs font-medium leading-[1.42188rem] text-[#646468] sm:text-sm">
                <p>
                  장이 예민해서 설사를 자주 했는데 나인독으로 바꾸고 나서 황금변을 봅니다. 다만
                  가격이 조금 있는 편이라 별 하나 뺐어요.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* 리뷰 페이지네이션 */}
      <PaginationWrapper
        currentPage={currentReviewPage}
        totalPages={reviewTotalPages}
        paramKey="reviewPage"
      />

      {/* QnA */}
      <div id="qna" className="mx-auto mt-14 flex max-w-[75rem] flex-col gap-2.5 sm:mt-28">
        <section className="flex flex-col gap-4 border-b border-black/[0.06] pb-5 sm:flex-row sm:justify-between sm:gap-6">
          <div className="flex flex-col items-start gap-2">
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
                  stroke-opacity="0.06"
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
            className="h-11 w-fit cursor-pointer self-start whitespace-nowrap rounded-[0.875rem] border-0 bg-[#fba613] px-[1.125rem] text-center text-[0.76875rem] font-bold leading-[1.09375rem] text-white shadow-[0_8px_32px_rgba(251,166,19,0.2)] sm:self-center"
          >
            문의 작성하기
          </Button>
        </section>

        <div className="flex flex-col">
          <section
            className="border-b border-black/[0.06]"
            onClick={() => setOpenQnaId(openQnaId === 2 ? null : 2)}
          >
            <button
              type="button"
              className="flex w-full flex-col gap-2 border-0 bg-transparent py-4 text-left text-inherit sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-[18px] sm:py-[26px]"
            >
              <span className="inline-flex h-7 w-fit items-center justify-center whitespace-nowrap  px-3">
                <svg
                  width="60"
                  height="24"
                  viewBox="0 0 60 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0.5" y="0.5" width="59" height="23" rx="6.5" fill="#F0FDF4" />
                  <rect x="0.5" y="0.5" width="59" height="23" rx="6.5" stroke="#DCFCE7" />
                  <path
                    d="M18.873 7.47266V9.35742H20.0352V10.5098H18.873V12.2773H17.4668V7.47266H18.873ZM16.0605 8V9.11328H13.4629V10.9688C15.0254 10.959 15.875 10.915 16.8125 10.7051L16.959 11.8184C15.875 12.0527 14.8496 12.1016 12.8281 12.1016H12.0566V8H16.0605ZM14.3223 12.6875V13.4297H17.4668V12.6875H18.873V16.3398H12.9258V12.6875H14.3223ZM14.3223 15.2266H17.4668V14.5332H14.3223V15.2266ZM28.4648 7.48242V14.084H27.0684V11.9746H25.5645V12.707H21.2383V8.06836H22.6543V9.36719H24.1777V8.06836H25.5645V8.9375H27.0684V7.48242H28.4648ZM28.6504 15.168V16.291H22.4492V13.4199H23.875V15.168H28.6504ZM22.6543 11.6133H24.1777V10.4316H22.6543V11.6133ZM25.5645 10.8516H27.0684V10.0605H25.5645V10.8516ZM32.7051 7.82422C34.0137 7.82422 34.9609 8.57617 34.9707 9.66992C34.9609 10.5195 34.3506 11.1836 33.4277 11.4082V12.0039C34.082 11.9648 34.7363 11.9014 35.3516 11.8184L35.459 12.8242C33.6328 13.1562 31.6113 13.1953 30.127 13.1953L29.9902 12.0918C30.5908 12.0918 31.2842 12.0869 32.0117 12.0625V11.418C31.0693 11.1982 30.4395 10.5293 30.4395 9.66992C30.4395 8.57617 31.3867 7.82422 32.7051 7.82422ZM32.7051 8.87891C32.1387 8.88867 31.7383 9.14258 31.748 9.66992C31.7383 10.1582 32.1387 10.4316 32.7051 10.4316C33.2715 10.4316 33.6523 10.1582 33.6523 9.66992C33.6523 9.14258 33.2715 8.88867 32.7051 8.87891ZM37.2363 7.48242V10.2363H38.3203V11.3984H37.2363V14.3184H35.8301V7.48242H37.2363ZM37.5391 15.1582V16.2812H31.1328V13.7129H32.5488V15.1582H37.5391ZM47.3555 14.3281V15.4707H39.1621V14.3281H41.1934V13.0586H40.0801V9.97266H45.0508V9.15234H40.0703V8.0293H46.4375V11.0859H41.4863V11.9258H46.6426V13.0586H45.4316V14.3281H47.3555ZM42.5605 14.3281H44.0449V13.0586H42.5605V14.3281Z"
                    fill="#16A34A"
                  />
                </svg>
              </span>
              <p className="m-0 text-sm font-extrabold tracking-[-0.01em] sm:text-lg">
                알러지 성분이 포함되어 있나요?
              </p>
              <p className="m-0 whitespace-nowrap text-xs font-semibold text-[#909094] sm:text-sm">
                댕댕이파더 | 2024.01.11
              </p>
              <span
                className={`hidden text-lg leading-none text-[#909094] transition-transform sm:block ${openQnaId === 2 ? "rotate-180" : ""}`}
              >
                <svg
                  width="32"
                  height="18"
                  viewBox="0 0 32 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <svg clip-path="url(#clip0_131_26700)">
                    <path
                      d="M27.8529 6.5625L22.7487 11.6667L17.6445 6.5625"
                      stroke="#909094"
                      stroke-width="2.1875"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <defs>
                    <clipPath id="clip0_131_26700">
                      <rect width="17.5" height="17.5" fill="white" transform="translate(14)" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </button>

            {/* 아코디언 메뉴바 */}
            <div
              className={`flex bg-gray-200 overflow-hidden transition-all duration-300 ${openQnaId === 2 ? "max-h-96 py-7 px-7" : "max-h-0 py-0 px-0"}`}
            >
              <svg
                className="shrink-0 pr-2"
                width="56"
                height="74"
                viewBox="0 0 56 74"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="12" fill="#FBA613" />
                <path
                  d="M20 12 L14 28 M20 12 L26 28 M15.5 22 L24.5 22"
                  stroke="#FFF9F2"
                  strokeWidth="2.04167"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="text-lg text-[#646468]">
                본 제품은 그레인프리 레시피로 설계되어 옥수수, 밀, 대두 등 주요 곡물 알러지 유발
                성분을 배제하였습니다. 상세 원재료 표를 확인 부탁드립니다.
              </span>
            </div>
          </section>

          <section className="border-b border-black/[0.06]">
            <button
              type="button"
              className="flex w-full flex-col gap-2 border-0 bg-transparent py-4 text-left text-inherit sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-[18px] sm:py-[26px]"
            >
              <span className="inline-flex h-7 w-fit items-center justify-center whitespace-nowrap  px-3">
                <svg
                  width="60"
                  height="28"
                  viewBox="0 0 60 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="3.5" width="60" height="24" rx="7" fill="#F0F0F3" />
                  <rect
                    x="0.5"
                    y="4"
                    width="59"
                    height="23"
                    rx="6.5"
                    stroke="black"
                    stroke-opacity="0.06"
                  />
                  <path
                    d="M18.873 10.9727V12.8574H20.0352V14.0098H18.873V15.7773H17.4668V10.9727H18.873ZM16.0605 11.5V12.6133H13.4629V14.4688C15.0254 14.459 15.875 14.415 16.8125 14.2051L16.959 15.3184C15.875 15.5527 14.8496 15.6016 12.8281 15.6016H12.0566V11.5H16.0605ZM14.3223 16.1875V16.9297H17.4668V16.1875H18.873V19.8398H12.9258V16.1875H14.3223ZM14.3223 18.7266H17.4668V18.0332H14.3223V18.7266ZM28.4648 10.9824V17.584H27.0684V15.4746H25.5645V16.207H21.2383V11.5684H22.6543V12.8672H24.1777V11.5684H25.5645V12.4375H27.0684V10.9824H28.4648ZM28.6504 18.668V19.791H22.4492V16.9199H23.875V18.668H28.6504ZM22.6543 15.1133H24.1777V13.9316H22.6543V15.1133ZM25.5645 14.3516H27.0684V13.5605H25.5645V14.3516ZM37.793 10.9727V19.9375H36.4648V15.5039H35.7422V19.5078H34.4629V11.1094H35.7422V14.3906H36.4648V10.9727H37.793ZM33.584 11.998V13.1211H31.6602V16.7832C32.4316 16.7734 33.1592 16.7295 33.9746 16.5879L34.0723 17.7207C32.9688 17.9355 32.002 17.9648 30.8887 17.9648H30.2441V11.998H33.584ZM46.7305 10.9727V19.9375H45.3047V10.9727H46.7305ZM44.0352 11.9004C44.0352 14.6641 43.1562 16.9102 39.8945 18.4434L39.1621 17.3301C41.4424 16.251 42.3994 14.9277 42.5996 12.9941H39.6699V11.9004H44.0352Z"
                    fill="#646468"
                  />
                </svg>
              </span>
              <p className="m-0 text-sm font-extrabold tracking-[-0.01em] sm:text-lg">
                샘플 신청이 가능한가요?
              </p>
              <p className="m-0 whitespace-nowrap text-xs font-semibold text-[#909094] sm:text-sm">
                멍뭉이 | 2024.01.09
              </p>
              <span
                className={`hidden text-lg leading-none text-[#909094] transition-transform duration-300 sm:block ${openQnaId === 2 ? "rotate-180" : ""}`}
              >
                <svg
                  width="32"
                  height="18"
                  viewBox="0 0 32 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <svg clip-path="url(#clip0_131_26700)">
                    <path
                      d="M27.8529 6.5625L22.7487 11.6667L17.6445 6.5625"
                      stroke="#909094"
                      stroke-width="2.1875"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <defs>
                    <clipPath id="clip0_131_26700">
                      <rect width="17.5" height="17.5" fill="white" transform="translate(14)" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
          </section>
        </div>
      </div>

      {/* QnA 페이지네이션 */}
      <PaginationWrapper
        currentPage={currentQnaPage}
        totalPages={qnaTotalPages}
        paramKey="qnaPage"
      />

      {/* 구매 모달 */}
      <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
