"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Clock,
  Package,
  AlertTriangle,
  Users,
  ShoppingCart,
  Plus,
  ArrowRight,
  Eye,
  CircleCheckBig,
  DollarSign,
  BarChart3,
} from "lucide-react";

// 타입 정의
interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  urgent?: boolean;
}

interface PendingQnA {
  id: number;
  question: string;
  author: string;
  productName: string;
  createdAt: string;
  hoursAgo: number;
}

interface AlertProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  status: "low_stock" | "out_of_stock" | "pending_review";
  imageUrl: string;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  amount: number;
  status: "pending" | "confirmed" | "shipping" | "delivered";
  createdAt: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  imageUrl: string;
}

// 목데이터
const statCards: StatCard[] = [
  {
    id: "revenue",
    label: "오늘 매출",
    value: "₩1,847,000",
    change: 12.5,
    changeLabel: "어제 대비",
    icon: <DollarSign className="w-6 h-6 text-green-600" />,
    bgColor: "bg-green-100",
    textColor: "text-gray-900",
  },
  {
    id: "pending_qna",
    label: "답변 대기 Q&A",
    value: 3,
    icon: <MessageCircle className="w-6 h-6 text-orange-600" />,
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    urgent: true,
  },
  {
    id: "low_stock",
    label: "재고 부족 상품",
    value: 5,
    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    urgent: true,
  },
  {
    id: "new_members",
    label: "오늘 신규 회원",
    value: 24,
    change: 8.3,
    changeLabel: "어제 대비",
    icon: <Users className="w-6 h-6 text-blue-600" />,
    bgColor: "bg-blue-100",
    textColor: "text-gray-900",
  },
];

const pendingQnAs: PendingQnA[] = [
  {
    id: 3,
    question: "노이즈 캔슬링 기능이 있나요?",
    author: "박민수",
    productName: "Wireless Headphones Pro",
    createdAt: "2026-01-21 10:35",
    hoursAgo: 2,
  },
  {
    id: 5,
    question: "보증 기간은 얼마나 되나요?",
    author: "정현우",
    productName: "Wireless Headphones Pro",
    createdAt: "2026-01-21 08:20",
    hoursAgo: 5,
  },
  {
    id: 7,
    question: "색상 옵션이 어떻게 되나요?",
    author: "윤서연",
    productName: "Wireless Headphones Pro",
    createdAt: "2026-01-20 18:45",
    hoursAgo: 18,
  },
];

const alertProducts: AlertProduct[] = [
  {
    id: "1",
    name: "Wireless Earbuds Mini",
    sku: "WE-MINI-001",
    stock: 0,
    status: "out_of_stock",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Bluetooth Speaker Max",
    sku: "BS-MAX-002",
    stock: 3,
    status: "low_stock",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "USB-C Charging Cable",
    sku: "UC-CBL-003",
    stock: 5,
    status: "low_stock",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  },
];

const recentOrders: RecentOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-2026-0121-001",
    customerName: "김서준",
    productName: "Wireless Headphones Pro",
    amount: 299000,
    status: "pending",
    createdAt: "2026-01-21 12:30",
  },
  {
    id: "2",
    orderNumber: "ORD-2026-0121-002",
    customerName: "이지민",
    productName: "Bluetooth Speaker Max",
    amount: 189000,
    status: "confirmed",
    createdAt: "2026-01-21 11:45",
  },
  {
    id: "3",
    orderNumber: "ORD-2026-0121-003",
    customerName: "박예은",
    productName: "Wireless Earbuds Mini",
    amount: 129000,
    status: "shipping",
    createdAt: "2026-01-21 10:20",
  },
  {
    id: "4",
    orderNumber: "ORD-2026-0121-004",
    customerName: "최도윤",
    productName: "USB-C Charging Cable",
    amount: 15000,
    status: "delivered",
    createdAt: "2026-01-21 09:15",
  },
];

const topProducts: TopProduct[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    sales: 156,
    revenue: 46644000,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Bluetooth Speaker Max",
    sales: 89,
    revenue: 16821000,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Wireless Earbuds Mini",
    sales: 234,
    revenue: 30186000,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
];

// 주간 매출 데이터
const weeklyRevenue = [
  { day: "월", revenue: 1250000 },
  { day: "화", revenue: 1680000 },
  { day: "수", revenue: 1420000 },
  { day: "목", revenue: 1890000 },
  { day: "금", revenue: 2150000 },
  { day: "토", revenue: 2480000 },
  { day: "일", revenue: 1847000 },
];

// 가격 포맷
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
};

// 주문 상태 배지
function OrderStatusBadge({ status }: { status: RecentOrder["status"] }) {
  const statusConfig = {
    pending: {
      label: "주문 확인 중",
      className: "bg-yellow-100 text-yellow-700",
    },
    confirmed: {
      label: "주문 확인",
      className: "bg-blue-100 text-blue-700",
    },
    shipping: {
      label: "배송 중",
      className: "bg-purple-100 text-purple-700",
    },
    delivered: {
      label: "배송 완료",
      className: "bg-green-100 text-green-700",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// 재고 상태 배지
function StockStatusBadge({ status }: { status: AlertProduct["status"] }) {
  const statusConfig = {
    out_of_stock: {
      label: "품절",
      className: "bg-red-100 text-red-700",
    },
    low_stock: {
      label: "재고 부족",
      className: "bg-orange-100 text-orange-700",
    },
    pending_review: {
      label: "검수 대기",
      className: "bg-blue-100 text-blue-700",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// 경과 시간 색상
function getTimeColor(hours: number) {
  if (hours >= 24) return "text-red-600";
  if (hours >= 12) return "text-orange-600";
  return "text-yellow-600";
}

function getTimeBgColor(hours: number) {
  if (hours >= 24) return "bg-red-100";
  if (hours >= 12) return "bg-orange-100";
  return "bg-yellow-100";
}

export default function AdminDashboardPage() {
  const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.revenue));

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">오늘의 현황을 한눈에 확인하세요</p>
      </div>

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                <p className={`text-2xl font-semibold ${card.textColor}`}>
                  {card.value}
                  {card.urgent && (
                    <span className="ml-2 text-xs font-normal text-gray-500">건</span>
                  )}
                </p>
              </div>
              <div className={`p-3 ${card.bgColor} rounded-lg`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 답변 대기 Q&A */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">답변 대기 Q&A</h2>
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                {pendingQnAs.length}건
              </span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
              전체보기
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingQnAs.map((qna) => (
              <div key={qna.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTimeBgColor(
                          qna.hoursAgo,
                        )} ${getTimeColor(qna.hoursAgo)}`}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {qna.hoursAgo}시간 전
                      </span>
                      <span className="text-xs text-gray-500">{qna.productName}</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium truncate">{qna.question}</p>
                    <p className="text-xs text-gray-500 mt-1">작성자: {qna.author}</p>
                  </div>
                  <button className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    답변하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주의 필요 상품 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">주의 필요 상품</h2>
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {alertProducts.length}건
              </span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
              전체보기
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {alertProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StockStatusBadge status={product.status} />
                      <span className="text-xs text-gray-500">재고: {product.stock}개</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 주문 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">최근 주문</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
            전체보기
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문일시
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatPrice(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
