import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border-primary pt-12 pb-10 md:pt-16 md:pb-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 mb-10 md:mb-12 text-center md:text-left">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2 cursor-pointer group">
              {/* 로고 */}
              <Link href="/" className="flex items-center">
                <Image src="/images/logo.png" alt="9Dog" width={120} height={40} />
              </Link>
            </div>
            <p className="text-xs md:text-sm font-bold text-text-secondary">
              반려견을 위한 건강한 간식·사료 정기구독 서비스
            </p>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <h4 className="text-xs md:text-sm font-black text-text-primary uppercase tracking-wider mb-2 md:mb-3">
              고객센터
            </h4>
            <p className="text-[11px] md:text-xs font-bold text-text-secondary">
              운영시간 10:00 ~ 18:00 (주말·공휴일 제외)
            </p>
            <p className="text-[11px] md:text-xs font-bold text-text-secondary">
              문의 <span className="text-text-primary font-black">support@gudog.co.kr</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-3 md:gap-x-6 py-6 border-y border-border-primary mb-10">
          <button className="text-[11px] md:text-xs font-black text-text-secondary hover:text-accent-primary transition-colors">
            이용약관
          </button>
          <span className="hidden md:inline text-border-secondary text-xs">|</span>
          <button className="text-[11px] md:text-xs font-black text-text-primary hover:text-accent-primary transition-colors">
            개인정보처리방침
          </button>
          <span className="hidden md:inline text-border-secondary text-xs">|</span>
          <button className="text-[11px] md:text-xs font-black text-text-secondary hover:text-accent-primary transition-colors">
            정기구독 안내
          </button>
        </div>

        {/* 하단 섹션: 사업자 상세 정보 */}
        <div className="space-y-6 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
            <div className="space-y-1 md:space-y-1.5">
              <p className="text-[10px] md:text-[12px] font-bold text-text-tertiary">
                상호명: <span className="text-text-secondary">구DOG</span>
              </p>
              <p className="text-[10px] md:text-[12px] font-bold text-text-tertiary">
                대표자: <span className="text-text-secondary">고은별</span>
              </p>
            </div>
            <div className="space-y-1 md:space-y-1.5">
              <p className="text-[10px] md:text-[12px] font-bold text-text-tertiary">
                사업자등록번호: <span className="text-text-secondary">000-00-00000</span>
              </p>
              <p className="text-[10px] md:text-[12px] font-bold text-text-tertiary">
                통신판매업 신고번호:{" "}
                <span className="text-text-secondary">제2026-서울강남-0000호</span>
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] md:text-[12px] font-bold text-text-tertiary">
                주소: <span className="text-text-secondary">서울특별시 강남구 테헤란로 123</span>
              </p>
            </div>
          </div>

          <p className="text-[8px] md:text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] pt-4 border-t md:border-t-0 border-border-primary">
            © 2026 구DOG. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
