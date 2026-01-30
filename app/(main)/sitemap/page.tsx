"use client";

import React from "react";
import Link from "next/link";

interface SitemapItem {
  title: string;
  href: string;
  depth: number;
}

interface Section {
  section: string;
  items: SitemapItem[];
}

const SitemapPage: React.FC = () => {
  const sitemapData: Section[] = [
    {
      section: "메인",
      items: [{ title: "메인 페이지", href: "/", depth: 0 }],
    },
    {
      section: "인증",
      items: [
        { title: "로그인", href: "/login", depth: 1 },
        { title: "회원가입", href: "/signup", depth: 1 },
      ],
    },
    {
      section: "설문 · 추천",
      items: [
        { title: "라이프스타일 설문", href: "/survey", depth: 1 },
        { title: "설문 결과", href: "/survey/result", depth: 2 },
      ],
    },
    {
      section: "상품",
      items: [
        { title: "상품 목록", href: "/products", depth: 1 },
        { title: "상품 상세", href: "/products/{productId}", depth: 2 },
        { title: "상품 문의", href: "/products/{productId}/qna", depth: 3 },
      ],
    },
    {
      section: "구매",
      items: [
        { title: "장바구니", href: "/cart", depth: 1 },
        { title: "결제", href: "/checkout", depth: 2 },
      ],
    },
    {
      section: "마이페이지",
      items: [
        // { title: "마이페이지 메인", href: "/mypage", depth: 1 },
        { title: "회원정보 수정", href: "/mypage/profile", depth: 2 },
        { title: "구독 관리", href: "/mypage/subscription", depth: 2 },
        { title: "주문 내역", href: "/mypage/order", depth: 2 },
        {
          title: "후기 등록",
          href: "/mypage/order/1/review",
          depth: 3,
        },
        { title: "관심 상품", href: "/mypage/wishlist", depth: 2 },
      ],
    },
    {
      section: "고객센터",
      items: [
        { title: "자주 묻는 질문", href: "/faq", depth: 1 },
        { title: "Q&A", href: "/qna", depth: 1 },
      ],
    },
    {
      section: "관리자",
      items: [
        { title: "관리자 대시보드", href: "/admin", depth: 0 },
        { title: "상품 관리", href: "/admin/products", depth: 1 },
        { title: "상품 등록", href: "/admin/products/new", depth: 2 },
        { title: "문의 관리", href: "/admin/qna", depth: 1 },
        { title: "문의 관리", href: "/admin/qna/answer", depth: 2 },
      ],
    },
  ];

  // 섹션별 아이콘 매핑
  const sectionIcons: Record<string, React.ReactNode> = {
    메인: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    인증: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
    "설문 · 추천": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    상품: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    구매: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    마이페이지: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    고객센터: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    관리자: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="bg-bg-secondary min-h-screen pb-40 pt-20">
      <div className="container-custom">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">사이트맵</h2>
          <p className="text-text-secondary">작업자 확인용 임시페이지 입니다.</p>
        </div>

        {/* 사이트맵 그리드 */}
        <div className="max-w-300 mx-auto px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapData.map((sectionData, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-border-primary shadow-soft"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-soft text-accent-primary rounded-xl flex items-center justify-center">
                  {sectionIcons[sectionData.section]}
                </div>
                <h3 className="text-lg font-bold">{sectionData.section}</h3>
              </div>

              <ul className="space-y-2">
                {sectionData.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href.includes("{") ? "#" : item.href}
                      className={`block w-full px-4 py-3 rounded-xl bg-bg-secondary hover:bg-accent-soft transition-colors ${
                        item.href.includes("{") ? "cursor-not-allowed opacity-60" : ""
                      }`}
                      onClick={(e) => {
                        if (item.href.includes("{")) e.preventDefault();
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            item.depth === 0
                              ? "bg-accent-primary text-white"
                              : item.depth === 1
                                ? "bg-accent-soft text-accent-primary"
                                : item.depth === 2
                                  ? "bg-bg-tertiary text-text-secondary"
                                  : "bg-border-primary text-text-tertiary"
                          }`}
                        >
                          D{item.depth}
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary mt-1 truncate">{item.href}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Depth 범례 */}
        <div className="mt-12 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-accent-primary text-white text-xs font-medium">
              D0
            </span>
            <span className="text-text-secondary">메인</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-accent-soft text-accent-primary text-xs font-medium">
              D1
            </span>
            <span className="text-text-secondary">1차 메뉴</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-bg-tertiary text-text-secondary text-xs font-medium">
              D2
            </span>
            <span className="text-text-secondary">2차 메뉴</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-border-primary text-text-tertiary text-xs font-medium">
              D3
            </span>
            <span className="text-text-secondary">3차 메뉴</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
