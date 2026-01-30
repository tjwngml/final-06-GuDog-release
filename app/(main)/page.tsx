import FeatureCard from "@/app/(main)/_components/FeatureCard";
import FeatureItem from "@/app/(main)/_components/FeatureItem";
import HeroSwiper from "@/app/(main)/_components/HeroSwiper";
import ProductCard from "@/app/(main)/_components/ProductCard";
import SectionTitle from "@/app/(main)/_components/SectionTitle";
import { getProducts } from "@/lib/product";
import Image from "next/image";

export default async function Home() {
  const bestProductsRes = await getProducts({ sort: { rating: -1 }, limit: 3 });

  if (!bestProductsRes.ok) {
    return <div>{bestProductsRes.message}</div>;
  }

  console.log("Home");
  const bestProducts = bestProductsRes.item;
  console.log(bestProducts);

  return (
    <>
      <div className="w-full">
        <HeroSwiper />
      </div>
      <section className="py-35 bg-white relative">
        <div className="container-custom">
          <SectionTitle
            align="center"
            title={
              <>
                데이터로 그리는 <br />
                <span className="text-accent-primary">가장 정밀한</span> 건강 지도
              </>
            }
            description="단순한 설문이 아닙니다. 아이의 생체 리듬과 활동량, 알러지 정보까지 모두 통합하여 가장
              과학적인 한 그릇을 설계합니다."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-100 lg:max-w-300 mx-auto">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
              title="반려견 정보 입력"
              description="반려견의 정보를 안내에 따라 입력합니다."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="#3B82F6" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              iconBgColor="#EFF6FF"
              title="AI 건강 분석"
              description="매일의 활동 데이터를 기반으로 최적의 칼로리를 제안합니다."
              bgColor="bg-[#fff]"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="정기 배송 관리"
              description="아이가 먹는 속도에 맞춰 배송 주기를 자동 조절합니다."
            />
          </div>
        </div>
      </section>

      <section className="py-35 bg-[#FFF5E6] relative">
        <div className="container-custom">
          <SectionTitle
            title={
              <>
                수많은 견주님들이 <br />
                증명하는 <span className="text-accent-primary">최고의 사료</span>
              </>
            }
            description="구독의 모든 사료는 원재료의 풍미를 살린 저온 조리 방식을 채택합니다."
            descriptionWidth="w-full"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {bestProducts.map((product) => {
              const totalKcal =
                product.extra?.kcalPer100g && product.extra?.weight
                  ? Math.round((product.extra.kcalPer100g * product.extra.weight) / 100)
                  : null;

              return (
                <ProductCard
                  key={product._id}
                  image={`${product.mainImages[0]?.path}`}
                  title={product.name}
                  kcal={totalKcal ? `${totalKcal.toLocaleString()} kcal` : ""}
                  description={product.content}
                  tag={product.extra?.category?.[0] ?? ""}
                  href={`/products/${product._id}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-35 bg-white relative">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row justify-center gap-30">
            <div>
              <SectionTitle
                align="center"
                alignLg="left"
                title={
                  <>
                    반려견을 위한 <br />
                    <span className="text-accent-primary">건강한 식단</span> 을 제공합니다.
                  </>
                }
              />
              <div className="flex flex-col items-center lg:items-start gap-10 -mt-6">
                <FeatureItem
                  icon={<img src="/icons/chart-box-orange.svg" alt="" className="w-14.5 h-14.5" />}
                  title="실시간 영양 최적화"
                  description="우리는 모든 반려견이 건강하고 행복한 삶을 살 수 있도록, 최고 품질의 사료와 과학적인 영양배합으로 사료를 제공합니다."
                />
                <FeatureItem
                  icon={<img src="/icons/verify-box-orange.svg" alt="" className="w-14.5 h-14.5" />}
                  title="맞춤 영양 솔루션"
                  description="10년 이상의 연구와 경험을 바탕으로 반려견의 나이, 크기, 건강상태에 
맞는 맞춤형 영양 솔루션을 개발했습니다."
                />

                <FeatureItem
                  icon={<img src="/icons/qr-box-orange.svg" alt="" className="w-14.5 h-14.5" />}
                  title="신선한 원재료"
                  description="정기 구독을 통해 편리하게 신선한 사료를 받아보시고, 우리 아이의 건강한
식습관을 함께 만들어가세요."
                />
              </div>
            </div>
            <Image
              className="hidden lg:inline-block"
              src="/images/logo-D.png"
              alt=""
              width={394}
              height={459}
            />
          </div>
        </div>
      </section>
    </>
  );
}
