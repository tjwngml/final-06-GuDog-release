import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative w-full min-h-[85vh] flex items-center bg-white overflow-hidden pb-12 pt-10 bg-[url('/images/visual02.png')] bg-cover">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* 좌측: 헤드라인 및 CTA */}
            <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center mb-6">
                <span className="w-2 h-2 rounded-full bg-accent-primary mr-2 animate-pulse"></span>
                <span className="text-text-secondary text-xs font-bold tracking-tight">
                  전체 12,402마리의 반려견이 관리받고 있습니다
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-light text-text-primary leading-[1.1] tracking-tighter mb-8 text-balance">
                강아지가 <br />
                기다리는 <br />
                <b className="font-bold">
                  <span className="text-accent-primary">완벽한</span> 사료.
                </b>
              </h1>

              <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-md font-medium text-wrap">
                단순한 사료가 아닙니다. 데이터 기반의 정밀 영양 설계로 아이의
                생애 주기를 완벽하게 케어합니다.
              </p>

              <Button
                variant="primary"
                href="/survey"
                className="px-10 py-5 text-lg rounded-2xl shadow-glow bg-[#FBA613] hover:bg-[#E59200] border-none"
              >
                무료 추천 사료 시작
              </Button>
            </div>

            {/* 우측: 시안의 대시보드 비주얼 */}
            <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/visual01.png"
                    alt=""
                    width={714}
                    height={455}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Link href="/sitemap">사이트맵</Link>
      test
    </>
  );
}
