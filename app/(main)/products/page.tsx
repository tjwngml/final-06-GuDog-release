import PaginationWrapper from "@/components/common/PaginationWrapper";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/product";

interface Props {
  searchParams: Promise<{
    page?: string;
    lifeStage?: string;
    category?: string;
    type?: string;
  }>;
}

// 상품 목록 페이지
export default async function Products({ searchParams }: Props) {
  const { page, lifeStage, category, type } = await searchParams;
  const currentPage = Number(page) || 1;
  const custom = {
    ...(lifeStage && { "extra.lifeStage": lifeStage }),
    ...(category && { "extra.category": category }),
    "extra.type": type || "사료",
  };

  const resProducts = await getProducts({
    custom,
    page: currentPage,
    limit: 10,
  });

  if (resProducts.ok === 0) {
    return <div>{resProducts.message}</div>;
  }

  const products = resProducts.item;
  const totalPages = resProducts.pagination.totalPages;

  return (
    <div className="w-full min-w-90 bg-bg-secondary px-4 py-10 sm:px-10 md:px-20 lg:px-89 lg:py-17.5 lg:pb-35">
      <div className="mx-auto flex max-w-300 flex-col items-center gap-8 sm:gap-10 lg:gap-14">
        <section className="flex w-full max-w-290 flex-col items-center text-center px-2">
          <h1 className="pb-3 text-2xl sm:text-3xl lg:text-[2.625rem]">상품 목록</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            아이의 연령대와 건강 상태에 맞게 설계된 프리미엄 영양 식단을 만나보세요.
          </p>
        </section>

        {/* 필터 태그 - 사료일 때만 표시 */}
        {(!type || type === "사료") && (
          <nav className="w-full flex justify-center">
            {/* 바깥 캡슐 */}
            <div className="flex flex-col sm:flex-row items-center rounded-3xl sm:rounded-[2.25rem] border border-black/10 bg-white p-2 sm:p-1.75 shadow-[0_20px_60px_rgba(0,0,0,0.08)] w-full max-w-70 sm:max-w-none sm:w-auto gap-1 sm:gap-0">
              {[
                { label: "전체보기", value: "" },
                { label: "퍼피 (Puppy)", value: "퍼피" },
                { label: "성견 (Adult)", value: "성견" },
                { label: "시니어 (Senior)", value: "시니어" },
              ].map((filter) => {
                const isActive = lifeStage === filter.value || (!lifeStage && filter.value === "");
                const params = new URLSearchParams();
                if (filter.value) params.set("lifeStage", filter.value);
                if (category) params.set("category", category);
                if (type) params.set("type", type);
                const href = params.toString() ? `/products?${params.toString()}` : "/products";

                return (
                  <Link
                    key={filter.label}
                    href={href}
                    className={`relative h-10 sm:h-12.5 w-full sm:w-28 md:w-32 lg:w-38 rounded-[1.25rem] sm:rounded-[1.75rem] text-xs sm:text-sm text-center flex items-center justify-center ${
                      isActive
                        ? "bg-accent-primary text-white font-extrabold"
                        : "bg-transparent text-text-tertiary font-bold hover:text-text-primary"
                    }`}
                  >
                    {filter.label}
                    {isActive && (
                      <span className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-40 -translate-x-1/2 rounded-full bg-accent-primary/40 blur-2xl hidden sm:block" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        {/* 상품 목록 그리드 */}
        <section className="w-full">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-7">
            {/* map을 사용해서 하드코딩한 li를 여러개 찍어 낼수 있음 */}
            {/* 1요소 > item > li 1개 생성 */}
            {products.map((product) => (
              <li
                key={product._id}
                className="flex w-[calc(25%-21px)] min-w-62.5 flex-col overflow-hidden rounded-3xl sm:rounded-[2.1875rem] border border-black/10 bg-white"
              >
                <Link
                  href={`/products/${product._id}`}
                  className="flex w-full flex-col no-underline"
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-white">
                    <Image
                      src={product.mainImages[0]?.path || "/placeholder.png"}
                      alt={product.name}
                      width={280}
                      height={280}
                      className="block h-full w-full object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 px-3 py-3 sm:px-4 sm:py-4">
                    <h3 className="text-base sm:text-lg font-black leading-6 tracking-tight text-text-primary">
                      {product.name}
                    </h3>
                    <p className="text-sm sm:text-base font-black leading-6 text-text-secondary">
                      {product.price.toLocaleString()}원
                    </p>

                    {product.extra?.lifeStage?.map((lifeStage) => (
                      <span
                        key={lifeStage}
                        className="inline-flex items-center rounded-md bg-orange-500/80 px-2.5 py-1 text-[0.625rem] font-normal uppercase leading-none tracking-wider text-white backdrop-blur-sm"
                      >
                        {lifeStage}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 페이지네이션 */}
        <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
