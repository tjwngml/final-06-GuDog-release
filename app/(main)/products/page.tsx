import PaginationWrapper from "@/components/common/PaginationWrapper";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Products({ params, searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <div className="w-full min-w-90 bg-bg-secondary px-4 py-10 sm:px-10 md:px-20 lg:px-89 lg:py-17.5 lg:pb-35">
      <div className="mx-auto flex max-w-300 flex-col items-center gap-8 sm:gap-10 lg:gap-14">
        <section className="flex w-full max-w-290 flex-col items-center text-center px-2">
          <h1 className="pb-3 text-2xl sm:text-3xl lg:text-[2.625rem]">상품 목록</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            아이의 연령대와 건강 상태에 맞게 설계된 프리미언 영양 식단을 만나보세요.
          </p>
        </section>

        {/* 필터 태그 */}
        <nav className="w-full flex justify-center">
          {/* 바깥 캡슐 */}
          <div className="flex flex-col sm:flex-row items-center rounded-3xl sm:rounded-[2.25rem] border border-black/10 bg-white p-2 sm:p-1.75 shadow-[0_20px_60px_rgba(0,0,0,0.08)] w-full max-w-70 sm:max-w-none sm:w-auto gap-1 sm:gap-0">
            <button
              type="button"
              className="relative h-10 sm:h-12.5 w-full sm:w-28 md:w-32 lg:w-38 rounded-[1.25rem] sm:rounded-[1.75rem] bg-accent-primary text-xs sm:text-sm font-extrabold text-white shadow-[0 2px 12px 0 rgba(0, 0, 0, 0.03)]"
            >
              전체보기
              {/* 선택된 탭 */}
              <span className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-40 -translate-x-1/2 rounded-full bg-[#fba613]/40 blur-2xl hidden sm:block" />
            </button>

            <button
              type="button"
              className="h-10 sm:h-12.5 w-full sm:w-28 md:w-32 lg:w-38 rounded-[1.25rem] sm:rounded-[1.75rem] bg-transparent text-xs sm:text-sm font-bold text-text-tertiary hover:text-text-primary"
            >
              퍼피 (Puppy)
            </button>

            <button
              type="button"
              className="h-10 sm:h-12.5 w-full sm:w-28 md:w-32 lg:w-38 rounded-[1.25rem] sm:rounded-[1.75rem] bg-transparent text-xs sm:text-sm font-bold text-text-tertiary hover:text-text-primary"
            >
              성견 (Adult)
            </button>

            <button
              type="button"
              className="h-10 sm:h-12.5 w-full sm:w-28 md:w-32 lg:w-38 rounded-[1.25rem] sm:rounded-[1.75rem] bg-transparent text-xs sm:text-sm font-bold text-text-tertiary hover:text-text-primary"
            >
              시니어 (Senior)
            </button>
          </div>
        </nav>

        {/* 상품 목록 그리드 */}
        <section className="w-full">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-7">
            {/* map을 사용해서 하드코딩한 li를 여러개 찍어 낼수 있음 */}
            {/* 1요소 > item > li 1개 생성 */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <li
                key={item}
                className="flex w-[calc(25%-21px)] min-w-62.5 flex-col overflow-hidden rounded-3xl sm:rounded-[2.1875rem] border border-black/10 bg-white"
              >
                <Link href="/products/1" className="flex w-full flex-col no-underline">
                  <div className="flex aspect-square w-full items-center justify-center bg-white">
                    <Image
                      src="/images/jointcare_chicken_brownrice.png"
                      alt="퍼피 치킨앤브라운라이스"
                      width={280}
                      height={280}
                      className="block h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 px-3 py-3 sm:px-4 sm:py-4">
                    <h3 className="text-base sm:text-lg font-black leading-6 tracking-tight text-text-primary">
                      퍼피 성장기 고메 A
                    </h3>
                    <p className="text-sm sm:text-base font-black leading-6 text-text-secondary">
                      28,000원
                    </p>

                    <span className="inline-flex items-center rounded-md bg-orange-500/80 px-2.5 py-1 text-[0.625rem] font-normal uppercase leading-none tracking-wider text-white backdrop-blur-sm">
                      PUPPY
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 페이지네이션 */}
        <PaginationWrapper currentPage={currentPage} totalPages={5} />
      </div>
    </div>
  );
}
