"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { parseResultCodes, getProductsByCodeList, type ProductData } from "@/lib";
import ProductImage from "@/components/common/ProductImage";
import ProductCard from "@/components/common/ProductCard";

function SurveyResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상품 데이터 상태
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 상위 제품 코드들 파싱
  const topCodesParam = searchParams.get("top");
  const topCodes = parseResultCodes(topCodesParam);

  // 설문 데이터 파라미터 읽기
  const sizeParam = searchParams.get("size") || "소형견";
  const ageParam = searchParams.get("age") || "adult";
  const proteinParam = searchParams.get("protein") || "상관없음";
  const healthParam = searchParams.get("health") || "";

  // 코드 배열로 필요한 상품만 조회
  useEffect(() => {
    async function fetchProducts() {
      if (!topCodes || topCodes.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const products = await getProductsByCodeList(topCodes);
        setTopProducts(products);
      } catch (error) {
        console.error("상품 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [topCodesParam]);

  // 메인 추천 제품은 1순위
  const mainProduct = topProducts[0];

  // 나이 라벨 변환
  const ageLabel = ageParam === "puppy" ? "퍼피" : ageParam === "adult" ? "성견" : "시니어";

  // 건강 고민 파싱
  const healthConcerns = healthParam ? healthParam.split(",").filter((c) => c !== "없음") : [];

  // 로딩 중
  if (isLoading) {
    return (
      <div
        className="bg-bg-secondary min-h-screen flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-text-secondary font-medium">추천 결과를 분석하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 제품이 없을 경우 에러 페이지
  if (!mainProduct || topProducts.length === 0) {
    return (
      <main className="bg-bg-secondary min-h-screen pb-40 pt-16" role="alert" aria-live="assertive">
        <div className="container-custom max-w-[900px] text-center">
          <h1 className="text-3xl font-black mb-4">추천 결과를 찾을 수 없습니다</h1>
          <p className="text-text-secondary mb-8">
            설문 조건에 맞는 제품을 찾지 못했어요. 조건을 변경해 다시 진행해 주세요.
          </p>
          <Button variant="primary" onClick={() => router.push("/survey")}>
            설문 다시하기
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-bg-secondary min-h-screen pb-20 pt-8 md:pb-40 md:pt-16">
      <div className="container-custom max-w-[1100px]">
        {/* 상단 요약 */}
        <section className="text-center mb-8 md:mb-16" aria-labelledby="result-title">
          <Badge variant="accent" className="mb-3 md:mb-4" aria-hidden="true">
            ANALYSIS COMPLETE
          </Badge>
          <h1
            id="result-title"
            className="text-2xl sm:text-3xl md:text-5xl font-black text-text-primary tracking-tighter mb-4 md:mb-6"
          >
            우리 아이를 위한 <span className="text-accent-primary">최적의 사료</span>를 찾았습니다
          </h1>
          <ul
            className="flex flex-wrap justify-center gap-2 md:gap-3"
            role="list"
            aria-label="선택된 설문 조건"
          >
            <li className="px-5 py-2.5 bg-white rounded-full text-xs font-black text-text-secondary border border-border-primary shadow-soft">
              # {sizeParam}
            </li>
            <li className="px-5 py-2.5 bg-white rounded-full text-xs font-black text-text-secondary border border-border-primary shadow-soft">
              # {ageLabel}
            </li>
            {proteinParam !== "상관없음" && (
              <li className="px-5 py-2.5 bg-white rounded-full text-xs font-black text-text-secondary border border-border-primary shadow-soft">
                # {proteinParam} 선호
              </li>
            )}
            {healthConcerns.map((concern) => (
              <li
                key={concern}
                className="px-5 py-2.5 bg-accent-soft rounded-full text-xs font-black text-accent-primary border border-accent-primary/20 shadow-soft"
              >
                # {concern} 케어
              </li>
            ))}
          </ul>
        </section>

        <section
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          aria-labelledby="main-recommendation"
        >
          {/* 메인 추천 제품 비주얼 (1순위) */}
          <div className="lg:col-span-5 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="bg-white rounded-[4rem] p-4 shadow-card border border-border-primary overflow-hidden group">
              <div className="aspect-square rounded-[3.5rem] overflow-hidden bg-bg-warm relative flex items-center justify-center">
                {mainProduct.mainImages?.[0] ? (
                  <ProductImage
                    src={`${mainProduct.mainImages[0].path}`}
                    alt={`${mainProduct.name} 제품 이미지`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div
                    className="text-[120px] group-hover:scale-110 transition-transform duration-700"
                    role="img"
                    aria-label="반려견 이미지"
                  >
                    🐕
                  </div>
                )}
              </div>
              <div className="p-10 text-center">
                <h2
                  id="main-recommendation"
                  className="text-3xl font-black text-text-primary mb-3 tracking-tighter"
                >
                  {mainProduct.name}
                </h2>
                <p
                  className="text-lg font-black text-accent-primary mb-8"
                  aria-label={`가격 ${mainProduct.price.toLocaleString()}원`}
                >
                  {mainProduct.price.toLocaleString()}원
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="primary"
                    className="flex-1 py-5 rounded-2xl shadow-glow"
                    href={`/products/${mainProduct._id}`}
                  >
                    제품 상세보기
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 rounded-2xl"
                    href="/survey"
                    aria-label="설문 다시하기"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 추천 사유 분석 */}
          <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
            <article className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-border-primary shadow-soft">
              <h3 className="text-xl font-black text-text-primary mb-10 tracking-tight flex items-center">
                <span
                  className="w-8 h-8 bg-accent-soft text-accent-primary rounded-xl flex items-center justify-center mr-3 text-sm"
                  aria-hidden="true"
                >
                  💡
                </span>
                영양 전문가의 추천 사유
              </h3>

              <ol className="space-y-6" aria-label="추천 사유 목록">
                <li className="p-6 bg-bg-secondary rounded-3xl border border-transparent hover:border-accent-soft transition-colors">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 bg-accent-primary text-white rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
                      aria-hidden="true"
                    >
                      1
                    </div>
                    <p className="text-sm font-medium text-text-secondary leading-relaxed pt-1">
                      <span className="font-black text-text-primary">
                        {mainProduct.extra.mainProtein.join(", ")} 기반
                      </span>
                      의 고품질 단백질이 함유되어 {sizeParam}의 근육 발달과 건강한 체형 유지에
                      도움을 줍니다.
                    </p>
                  </div>
                </li>

                {mainProduct.extra.healthBenefits.length > 0 && (
                  <li className="p-6 bg-bg-secondary rounded-3xl border border-transparent hover:border-accent-soft transition-colors">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 bg-accent-primary text-white rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
                        aria-hidden="true"
                      >
                        2
                      </div>
                      <p className="text-sm font-medium text-text-secondary leading-relaxed pt-1">
                        <span className="font-black text-text-primary">
                          {mainProduct.extra.healthBenefits.join(", ")}
                        </span>
                        에 특화된 영양 설계로 반려견의 건강 고민을 케어해드립니다.
                      </p>
                    </div>
                  </li>
                )}

                <li className="p-6 bg-bg-secondary rounded-3xl border border-transparent hover:border-accent-soft transition-colors">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 bg-accent-primary text-white rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
                      aria-hidden="true"
                    >
                      3
                    </div>
                    <p className="text-sm font-medium text-text-secondary leading-relaxed pt-1">
                      100g당 {mainProduct.extra.kcalPer100g}kcal의 적정 칼로리로 설계되어 {ageLabel}
                      의 활동량에 알맞은 에너지를 공급해줍니다.
                      {mainProduct.extra.bodyType.includes("과체중") ||
                        (mainProduct.extra.bodyType.includes("비만") &&
                          " 저칼로리 설계로 체중 관리에도 효과적입니다.")}
                    </p>
                  </div>
                </li>
              </ol>
            </article>

            {/* 영양 정보 */}
            <article className="bg-text-primary rounded-[3.5rem] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/20 rounded-full blur-[80px] pointer-events-none"
                aria-hidden="true"
              ></div>

              <h3 className="text-xl font-black mb-10 tracking-tight relative z-10">
                영양 밸런스 리포트
              </h3>

              <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <dt className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">
                    단백질
                  </dt>
                  <dd className="text-xl font-black">{mainProduct.extra.nutrition.protein}%</dd>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <dt className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">
                    지방
                  </dt>
                  <dd className="text-xl font-black">{mainProduct.extra.nutrition.fat}%</dd>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <dt className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">
                    칼로리
                  </dt>
                  <dd className="text-xl font-black text-accent-primary">
                    {mainProduct.extra.kcalPer100g}kcal
                  </dd>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <dt className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">
                    수분
                  </dt>
                  <dd className="text-xl font-black">{mainProduct.extra.nutrition.moisture}%</dd>
                </div>
              </dl>

              <div className="mt-10 p-6 bg-white/10 rounded-[2rem] border border-white/10 flex items-center space-x-6">
                <div
                  className="w-12 h-12 bg-accent-primary rounded-2xl flex items-center justify-center shrink-0 shadow-glow"
                  aria-hidden="true"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-bold leading-relaxed opacity-80">
                  {ageLabel}의 영양 요구량과 {sizeParam} 특성을 완벽히 반영한 영양 배합입니다.
                  주기적인 사료 변경 없이도 반려견의 성장 및 건강 상태에 맞춰 최적의 영양을
                  공급해줍니다.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* 다른 추천 제품 보기 (2~5순위) */}
        {topProducts.length > 1 && (
          <section
            className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
            aria-labelledby="other-recommendations"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 id="other-recommendations" className="text-2xl font-black text-text-primary">
                다른 추천 제품
              </h2>
              <Button variant="ghost" href="/products">
                전체 보기
              </Button>
            </div>

            <ul
              className="grid grid-cols-[repeat(auto-fill,240px)] gap-4 max-w-6xl mx-auto justify-center"
              role="list"
              aria-label="다른 추천 제품 목록"
            >
              {topProducts.slice(1).map((product, index) => (
                <ProductCard
                  key={`${product.extra.code}-${index}`}
                  product={product}
                  showLifeStage={false}
                  showRanking={true}
                  ranking={index + 2}
                />
              ))}
            </ul>
          </section>
        )}

        {/* 하단 액션 버튼 */}
        <section className="mt-20 flex flex-col items-center" aria-label="추가 액션">
          <p className="text-sm font-bold text-text-tertiary mb-8">더 궁금한 점이 있으신가요?</p>
          <div className="flex gap-4" role="group" aria-label="액션 버튼">
            <Button
              variant="outline"
              className="px-12 py-5 rounded-[1.5rem] font-black"
              href="/products"
            >
              전체 상품 구경하기
            </Button>
            <Button variant="ghost" className="px-10 rounded-[1.5rem]" href="/survey">
              설문 다시하기
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SurveyResultPage() {
  return (
    <Suspense
      fallback={
        <div
          className="bg-bg-secondary min-h-screen flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-text-secondary font-medium">추천 결과를 분석하고 있습니다...</p>
          </div>
        </div>
      }
    >
      <SurveyResultContent />
    </Suspense>
  );
}
