"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  X,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MessageCircleQuestion,
  House,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Profile from "@/app/(admin)/admin/_components/Profile";
import useUserStore from "@/zustand/useStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: House, label: "사용자 화면", path: "/" },
  { icon: LayoutDashboard, label: "대시보드", path: "/admin" },
  {
    icon: Package,
    label: "상품관리",
    subItems: [
      { label: "상품 목록", path: "/admin/products" },
      { label: "상품 등록", path: "/admin/products/new" },
    ],
  },
  { icon: MessageCircleQuestion, label: "QnA관리", path: "/admin/qna" },
];

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const userName = useUserStore((state) => state.user?.name);
  const userEmail = useUserStore((state) => state.user?.email);

  // 현재 경로가 메뉴 항목과 일치하는지 확인
  const isActive = (path: string, exact: boolean = false) => {
    // 정확히 일치
    if (pathname === path) return true;

    // exact 모드면 정확한 매칭만
    if (exact) return false;

    // 대시보드는 정확히 /admin일 때만 활성화
    if (path === "/admin") return false;

    // /new, /edit 등 특정 액션 경로는 정확한 매칭만
    if (path.endsWith("/new") || path.includes("/edit")) return false;

    // 상품 목록(/admin/products)은 상품 상세(/admin/products/[id])에서만 활성화
    // /admin/products/new 같은 경로에서는 활성화 안됨
    if (path === "/admin/products") {
      // /admin/products/숫자 형태일 때만 활성화 (상세 페이지)
      const match = pathname.match(/^\/admin\/products\/(\d+)/);
      return !!match;
    }

    // 그 외 하위 경로 포함
    return pathname.startsWith(path + "/");
  };

  // 서브메뉴를 가진 항목이 활성화 상태인지 확인
  const hasActiveSubItem = (subItems: SubMenuItem[]) => {
    return subItems.some((subItem) => isActive(subItem.path));
  };

  // 현재 경로에 해당하는 부모 메뉴 자동 펼치기
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems && hasActiveSubItem(item.subItems)) {
        setExpandedItems((prev) => (prev.includes(item.label) ? prev : [...prev, item.label]));
      }
    });
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/5 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigate("/admin")}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Admin</span>
            </div>
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isParentActive = hasSubItems && hasActiveSubItem(item.subItems!);
                const isItemActive = item.path ? isActive(item.path) : isParentActive;

                return (
                  <div key={index}>
                    {hasSubItems ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                            ${
                              isParentActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="flex items-center">
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {expandedItems.includes(item.label) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {expandedItems.includes(item.label) && (
                          <div className="mt-1 ml-4 space-y-1">
                            {item.subItems!.map((subItem, subIndex) => {
                              const isSubItemActive = isActive(subItem.path, true);

                              return (
                                <button
                                  key={subIndex}
                                  onClick={() => handleNavigate(subItem.path)}
                                  className={`
                                    w-full flex items-center px-4 py-2 rounded-lg transition-colors text-sm text-left
                                    ${
                                      isSubItemActive
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }
                                  `}
                                >
                                  <span
                                    className={`
                                      w-1.5 h-1.5 rounded-full mr-3
                                      ${isSubItemActive ? "bg-blue-600" : "bg-gray-400"}
                                    `}
                                  />
                                  {subItem.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => item.path && handleNavigate(item.path)}
                        className={`
                          w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left
                          ${
                            isItemActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <Profile />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
