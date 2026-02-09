"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useSyncExternalStore } from "react";
import useUserStore from "@/zustand/useStore";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, resetUser, cartCount, fetchCartCount, resetCart } = useUserStore();

  // useSyncExternalStore 훅 사용
  // 토큰 값 가져오기
  // const accessToken = useSyncExternalStore(
  //   () => () => {},
  //   () => Cookies.get("accessToken") ?? null,
  //   () => null,
  // );

  // zustand 에서 토큰 끌어오기 - hydration 에러 수정
  const isLoggedIn = !!user?.token?.accessToken;
  // // 로그인 여부는 토큰에서 파생
  // const isLoggedIn = !!accessToken;

  // 로그인 상태일 때 장바구니 수량 조회
  useEffect(() => {
    if (user?.token?.accessToken) {
      fetchCartCount(user.token.accessToken);
    } else {
      resetCart();
    }
  }, [user?.token?.accessToken, fetchCartCount, resetCart]);
  const handleLogout = (e: React.MouseEvent) => {
    // 세션 스토리지를 비우고 상태를 null로 초기화
    e.preventDefault();
    resetUser();

    Cookies.remove("accessToken");

    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "정기구독", href: "/survey" },
    {
      name: "상품보기",
      href: "/products?type=사료",
      subMenu: [
        { name: "사료", href: "/products?type=사료" },
        { name: "간식", href: "/products?type=간식" },
      ],
    },
    { name: "구매후기", href: "/reviews" },
    {
      name: "고객지원",
      href: "/support/faq",
      subMenu: [{ name: "자주 묻는 질문", href: "/support/faq" }],
    },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-xl border-b border-border-primary sticky top-0 z-[500]">
        {/* 최상단 유틸리티 바 (데스크탑 전용) */}
        <div className="hidden lg:block border-b border-border-primary bg-bg-secondary/50">
          <div className="max-w-[1200px] mx-auto px-4 h-10 flex items-center justify-end space-x-6">
            <Link
              href="/admin"
              className="text-[10px] font-black text-text-tertiary hover:text-text-primary uppercase tracking-widest transition-colors"
            >
              Admin Page
            </Link>
            <Link
              href="/mypage"
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                pathname === "/mypage"
                  ? "text-accent-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              My Account
            </Link>

            {isLoggedIn ? (
              /* 토큰이 있을 때 Logout 표시, 클릭 시 상태 리셋 후 메인 이동 */
              <Link
                href="/"
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest transition-colors text-text-tertiary hover:text-text-primary"
              >
                Logout
              </Link>
            ) : (
              /* 토큰이 없을 때 Login 표시 */
              <Link
                href="/login"
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  pathname === "/login"
                    ? "text-accent-primary"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                Login
              </Link>
            )}

            <Link
              href="/signup"
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                pathname === "/signup"
                  ? "text-accent-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Sign Up
            </Link>
            <Link
              href="/cart"
              className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center ${
                pathname === "/cart"
                  ? "text-accent-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Cart{" "}
              {cartCount > 0 && <span className="ml-1 text-accent-primary">({cartCount})</span>}
            </Link>
          </div>
        </div>

        {/* 메인 GNB */}
        <div className="max-w-[1200px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-16 w-full">
            {/* 로고 */}
            <Link href="/" className="flex items-center">
              <Image src="/images/logo.png" alt="9Dog" width={120} height={40} />
            </Link>

            {/* 네비게이션 메뉴 (데스크탑) */}
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-12">
                {navItems.map((item) => (
                  <li
                    key={item.name}
                    className="relative h-20 flex items-center"
                    onMouseEnter={() => setActiveMenu(item.name)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <Link
                      href={item.href}
                      className={`text-sm font-black tracking-tight transition-all relative py-2 ${
                        pathname === item.href || pathname?.startsWith(item.href.split("?")[0])
                          ? "text-accent-primary"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {item.name}
                      {(pathname === item.href ||
                        pathname?.startsWith(item.href.split("?")[0])) && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-primary rounded-full"></span>
                      )}
                    </Link>

                    {item.subMenu && activeMenu === item.name && (
                      <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-56 bg-white border border-border-secondary shadow-2xl rounded-3xl py-4">
                        {item.subMenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block w-full text-left px-6 py-3 text-xs font-bold text-text-secondary hover:text-accent-primary hover:bg-accent-soft transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href="/sitemap"
              className="block ms-auto text-sm tracking-tight transition-all relative py-2"
            >
              사이트맵
            </Link>
          </div>

          {/* 우측 액션 버튼 */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* 모바일 장바구니 */}
            <Link href="/cart" className="lg:hidden p-2 text-text-primary relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 햄버거 메뉴 (모바일) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-text-primary focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      {/* 모바일 전체 화면 네비게이션 드로어 */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-[1100] transition-transform duration-500 ease-in-out lg:hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 드로어 헤더 */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-primary shrink-0">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="9Dog" width={120} height={40} />
          </Link>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 드로어 컨텐츠 */}
        <div className="flex flex-col grow p-8 space-y-10 overflow-y-auto">
          {/* 모바일 계정 퀵 링크 */}
          <div className="flex gap-4">
            {isLoggedIn ? (
              <Link
                href="/"
                onClick={(e) => {
                  handleLogout(e);
                  closeMobileMenu();
                }}
                className="flex-1 py-4 bg-bg-secondary rounded-2xl text-sm font-black text-text-primary border border-border-primary active:scale-95 transition-all text-center"
              >
                로그아웃
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex-1 py-4 bg-bg-secondary rounded-2xl text-sm font-black text-text-primary border border-border-primary active:scale-95 transition-all text-center"
              >
                로그인
              </Link>
            )}
            <Link
              href="/signup"
              onClick={closeMobileMenu}
              className="flex-1 py-4 bg-accent-soft text-accent-primary rounded-2xl text-sm font-black border border-accent-primary/10 active:scale-95 transition-all text-center"
            >
              회원가입
            </Link>
          </div>

          {/* 메인 메뉴 목록 */}
          <nav className="space-y-8">
            {navItems.map((item) => (
              <div key={item.name} className="space-y-4">
                <Link
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="text-xl font-black text-text-primary flex items-center justify-between w-full group"
                >
                  <span className="group-hover:text-accent-primary transition-colors">
                    {item.name}
                  </span>
                  <svg
                    className="w-4 h-4 text-accent-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                {item.subMenu && (
                  <div className="flex flex-col space-y-3 pl-4 border-l-2 border-border-primary">
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={closeMobileMenu}
                        className="text-sm font-bold text-text-secondary text-left hover:text-accent-primary py-1"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* 유틸리티 항목 */}
            <div className="pt-4 space-y-8 border-t border-border-primary/50">
              <Link
                href="/mypage"
                onClick={closeMobileMenu}
                className="text-xl font-black text-text-primary flex items-center justify-between w-full group"
              >
                <span className="group-hover:text-accent-primary transition-colors">
                  마이페이지
                </span>
                <svg
                  className="w-4 h-4 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="text-xl font-black text-text-primary flex items-center justify-between w-full group"
              >
                <div className="flex items-center">
                  <span className="group-hover:text-accent-primary transition-colors">
                    장바구니
                  </span>
                  {cartCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-accent-primary text-white text-[10px] rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <svg
                  className="w-4 h-4 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="text-xl font-black text-text-tertiary flex items-center justify-between w-full group"
              >
                <span className="group-hover:text-text-primary transition-colors">Admin Page</span>
                <svg
                  className="w-4 h-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </nav>

          <div className="pt-10 border-t border-border-primary mt-auto pb-10">
            <div className="mt-8 text-center space-y-1">
              <p className="text-[11px] font-bold text-text-tertiary">
                운영시간 10:00 ~ 18:00 (주말·공휴일 제외)
              </p>
              <p className="text-[11px] font-bold text-text-tertiary">
                고객지원 support@gudog.co.kr
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
