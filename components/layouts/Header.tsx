"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const navItems = [
    { name: "구독 서비스", href: "/survey" },
    {
      name: "제품 보기",
      href: "/products",
      subMenu: [
        { name: "사료", href: "/products?category=food" },
        { name: "간식", href: "/products?category=snack" },
      ],
    },
    { name: "구매 후기", href: "/reviews" },
    {
      name: "고객지원",
      href: "/support/faq",
      subMenu: [{ name: "자주 묻는 질문", href: "/support/faq" }],
    },
  ];

  return (
    <header className="w-full bg-white/95 backdrop-blur-xl border-b border-border-primary sticky top-0 z-[200]">
      {/* 최상단 유틸리티 바 */}
      <div className="border-b border-border-primary bg-bg-secondary/50">
        <div className="max-w-[1200px] mx-auto h-10 flex items-center justify-end space-x-6">
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
            My Page
          </Link>
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
            Cart <span className="ml-1 text-accent-primary">(2)</span>
          </Link>
        </div>
      </div>

      {/* 메인 GNB */}
      <div className="container-custom max-w-[1200px] mx-auto h-20 flex items-center justify-between">
        <div className="flex items-center space-x-16 w-full">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="9Dog" width={120} height={40} />
          </Link>

          {/* 네비게이션 메뉴 */}
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
                      pathname === item.href
                        ? "text-accent-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {item.name}
                    {pathname === item.href && (
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
      </div>
    </header>
  );
};

export default Header;
