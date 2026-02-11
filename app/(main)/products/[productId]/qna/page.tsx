"use client";

import Contentdetail from "@/app/(main)/mypage/_components/Contentdetail";
import { useParams, useSearchParams } from "next/navigation";
import { PrevIcon } from "@/app/(main)/mypage/_components/Icons";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useUserStore from "@/zustand/useStore";
import { createQnaPost } from "@/actions/qna";
import { showWarning, showSuccess, showError } from "@/lib";

export default function ProductQnaForm() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const productId = Number(params.productId);
  const productName = searchParams.get("productName") || "";
  const productImage = searchParams.get("productImage") || "";

  const [category, setCategory] = useState<string>("상품");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_LEN = 200;

  const handleSubmit = async () => {
    if (!title.trim()) {
      showWarning("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      showWarning("문의 내용을 입력해 주세요.");
      return;
    }

    if (!user?.token?.accessToken) {
      showWarning("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await createQnaPost({
        title,
        content,
        product_id: productId,
        category,
        product_name: productName,
        product_img: productImage,
      });

      showSuccess("문의가 등록되었습니다!");
      router.push(`/products/${productId}`);
    } catch {
      showError("문의 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-[360px] gap-[35px] bg-[#F9F9F9] lg:bg-transparent">
      <main className="pt-[70px] pb-[112px] px-[20px] max-w-[1280px] mx-auto lg:px-0 flex flex-col items-center">
        <div className="w-full max-w-[632px]">
          <button
            type="button"
            className="flex flex-row gap-[7px] mb-[35px] bg-transparent border-0 cursor-pointer"
            onClick={() => router.back()}
            aria-label="이전 페이지로 돌아가기"
          >
            <PrevIcon className="w-[17.5px] h-[17.5px] text-[#909094]" aria-hidden="true" />
            <span className="text-[#909094] text-[11.7px] font-black">뒤로가기</span>
          </button>
        </div>

        <header className="flex flex-col items-center gap-[14px]">
          <h1 className="text-[#1A1A1C] text-center text-[29.5px] font-black">
            궁금한 점을 문의해 주세요
          </h1>
          <p className="text-[#646468] text-center text-[14.7px] font-medium pb-[35px] break-keep">
            관리자가 확인 후 정성스럽게 답변해 드립니다.
          </p>
        </header>

        {/* 문의 대상 상품 카드 */}
        {productName && (
          <div className="w-full max-w-[632px] mb-[35px] rounded-[21px] border border-black/[0.06] bg-white p-[20px] shadow-[0_2px_12px_0_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-[14px]">
              <div className="w-[60px] h-[60px] flex-shrink-0 overflow-hidden rounded-[12px]">
                <img
                  src={productImage || "/images/product-404.jpg"}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[#909094] text-[11px] font-bold">문의 대상 상품</p>
                <p className="text-[#1A1A1C] text-[16px] font-black">{productName}</p>
              </div>
            </div>
          </div>
        )}

        {/* 문의 작성 폼 */}
        <div
          className="bg-white w-full max-w-[632px] rounded-[35px] flex flex-col items-center p-[20px] lg:p-[40px] shadow-sm"
          role="form"
        >
          {/* 문의 유형 */}
          {/* <div className="w-full max-w-[532px]">
            <p className="text-[#1A1A1C] text-[11.5px] font-black mb-[12px]">문의 유형</p>
            <div className="flex flex-wrap gap-[10px] mb-[28px]">
              {CATEGORY_OPTIONS.map((opt) => (
                <Button
                  key={opt}
                  size="sm"
                  variant={category === opt ? "secondary" : "outline"}
                  onClick={() => setCategory(opt)}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div> */}

          {/* 제목 */}
          <div className="w-full max-w-[532px]">
            <label
              htmlFor="qna-title"
              className="text-[#1A1A1C] text-[11.5px] font-black mb-[8px] block"
            >
              제목
            </label>
            <Input
              id="qna-title"
              className="w-full mb-[28px]"
              label=""
              placeholder="제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 문의 내용 */}
          <div className="w-full max-w-[532px]">
            <Contentdetail
              className="w-full"
              label="문의 내용"
              placeholder="아이의 연령, 상태 등 구체적인 정보를 포함하면 더 정확한 답변이 가능합니다."
              currentLength={content.length}
              maxLength={MAX_LEN}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
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
                {isSubmitting ? "등록 중..." : "문의 등록하기"}
              </Button>
              <Button className="flex-1" size="md" variant="outline" onClick={() => router.back()}>
                취소
              </Button>
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div
          className="w-full max-w-[632px] mt-[40px] flex items-center gap-[12px] pt-[35px] pb-[28px] px-[28px] bg-[#FFF5E6]/30 rounded-[21px]"
          role="note"
        >
          <div className="flex-shrink-0 bg-white rounded-[15px] p-[10px]" aria-hidden="true">
            <svg
              width="30"
              height="30"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9" stroke="#FBA613" strokeWidth="1.5" />
              <path d="M10 6V11" stroke="#FBA613" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="14" r="0.75" fill="#FBA613" />
            </svg>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[#1A1A1C] text-[13px] font-black">알려드립니다</p>
            <p className="text-[#646468] text-[11.5px] font-medium leading-[18px]">
              문의하신 내용은 비밀글로 저장되며, 마이페이지에서 확인하실 수 있습니다.
              <br />
              개인정보(전화번호, 주소 등)가 포함되지 않도록 주의해 주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
