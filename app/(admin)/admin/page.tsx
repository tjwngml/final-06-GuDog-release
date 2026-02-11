"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Clock, AlertTriangle, Users, ShoppingCart, ArrowRight, DollarSign } from "lucide-react";
import { getProducts, getPosts, getOrders, getUsers, getOrderStatistics, showWarning } from "@/lib";
import { Order, Product, Post } from "@/types";
import useUserStore from "@/zustand/useStore";
import Link from "next/link";

// 가격 포맷
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
};

// 주문 상태 배지
function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "주문 확인 중", className: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "주문 확인", className: "bg-blue-100 text-blue-700" },
    shipping: { label: "배송 중", className: "bg-purple-100 text-purple-700" },
    delivered: { label: "배송 완료", className: "bg-green-100 text-green-700" },
  };

  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// 재고 상태 배지
function StockStatusBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        품절
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
      재고 부족
    </span>
  );
}

// 경과 시간 계산
function getHoursAgo(dateString: string) {
  const date = new Date(dateString.replace(/\./g, "-"));
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  return diff;
}

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
  const [loading, setLoading] = useState(true);

  // 통계
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingQna: 0,
    lowStockCount: 0,
  });

  // 리스트 데이터
  const [pendingQnAs, setPendingQnAs] = useState<Post[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const token = useUserStore.getState().user?.token?.accessToken;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    if (!token) {
      showWarning("재로그인 필요", "재로그인이 필요합니다");
      return;
    }

    // 1. 주문 통계 (총 판매금액 + 총 주문건수)
    const statsRes = await getOrderStatistics(token, { start: "2026.01.01" });
    let totalSales = 0;
    let totalOrders = 0;

    if (statsRes.ok && statsRes.item.length > 0) {
      totalSales = statsRes.item[0].totalSales;
      totalOrders = statsRes.item[0].totalQuantity;
    }

    // 2. 최근 주문 (별도로 5건만 조회)
    const ordersRes = await getOrders(token, { limit: 5 });
    let recentOrders: Order[] = [];

    if (ordersRes.ok) {
      recentOrders = ordersRes.item;
    }

    // 3. 회원 데이터 (총 회원수)
    const usersRes = await getUsers({ limit: 1 });
    const totalUsers = usersRes.ok ? usersRes.pagination.total : 0;

    // 4. QnA 데이터 (답변 대기건)
    const qnaRes = await getPosts({ boardType: "qna", limit: 9999 });
    let pendingQna = 0;
    let pendingList: Post[] = [];

    if (qnaRes.ok) {
      pendingList = qnaRes.item.filter((q: Post) => !q.replies || q.replies.length === 0);
      pendingQna = pendingList.length;
    }

    // 5. 상품 데이터 (재고 부족)
    const productsRes = await getProducts({ limit: 9999, showSoldOut: true });
    let lowStockCount = 0;
    let lowStockList: Product[] = [];

    if (productsRes.ok) {
      lowStockList = productsRes.item.filter((p: Product) => p.quantity - p.buyQuantity <= 100);
      lowStockCount = lowStockList.length;
    }

    setStats({
      totalSales,
      totalOrders,
      totalUsers,
      pendingQna,
      lowStockCount,
    });

    setPendingQnAs(pendingList.slice(0, 3)); // 상위 3건
    setLowStockProducts(lowStockList.slice(0, 5)); // 상위 5건
    setRecentOrders(recentOrders);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">전체 현황을 한눈에 확인하세요</p>
      </div>

      {/* 상단 통계 카드 */}
      <section className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 mb-6">
        {/* 총 판매금액 */}
        <div className="bg-white rounded-lg shadow p-5" role="region">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">총 판매금액</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPrice(stats.totalSales)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg" aria-hidden="true">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 총 주문건수 */}
        <div className="bg-white rounded-lg shadow p-5" role="region">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">총 주문건수</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}건</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg" aria-hidden="true">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 총 회원수 */}
        <div className="bg-white rounded-lg shadow p-5" role="region">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">총 회원수</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}명</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg" aria-hidden="true">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* 답변 대기 */}
        <div className="bg-white rounded-lg shadow p-5" role="region">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">답변 대기</p>
              <p className="text-2xl font-semibold text-orange-600">{stats.pendingQna}건</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg" aria-hidden="true">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* 재고 부족 */}
        <div className="bg-white rounded-lg shadow p-5" role="region">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">재고 부족</p>
              <p className="text-2xl font-semibold text-red-600">{stats.lowStockCount}건</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg" aria-hidden="true">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* 답변 대기 Q&A */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">답변 대기 Q&A</h2>
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                {stats.pendingQna}건
              </span>
            </div>
            <Link
              href="/admin/qna"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              전체보기
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingQnAs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">답변 대기 중인 문의가 없습니다.</div>
            ) : (
              pendingQnAs.map((qna) => {
                const hoursAgo = getHoursAgo(qna.createdAt);
                return (
                  <div key={qna._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTimeBgColor(hoursAgo)} ${getTimeColor(hoursAgo)}`}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {hoursAgo}시간 전
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium truncate">{qna.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          작성자: {qna.user?.name || "익명"}
                        </p>
                      </div>
                      <Link
                        href={`/admin/qna/${qna._id}/answer`}
                        className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        답변하기
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 재고 부족 상품 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">재고 부족 상품</h2>
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {stats.lowStockCount}건
              </span>
            </div>
            <Link
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              전체보기
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">재고 부족 상품이 없습니다.</div>
            ) : (
              lowStockProducts.map((product) => {
                const stock = product.quantity - product.buyQuantity;
                return (
                  <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.mainImages?.[0]?.path || "/placeholder.png"}
                        alt={`${product.name} 썸네일`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StockStatusBadge stock={stock} />
                          <span className="text-xs text-gray-500">재고: {stock}개</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 최근 주문 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">최근 주문</h2>
          {/* <button className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
            전체보기
            <ArrowRight className="w-4 h-4 ml-1" />
          </button> */}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">최근 주문 목록</caption>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  주문번호
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  고객명
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  상품
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  금액
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  상태
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  주문일시
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    주문 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user?.name || "비회원"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.products?.[0]?.name || "-"}
                      {order.products?.length > 1 && ` 외 ${order.products.length - 1}건`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatPrice(order.cost?.total || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.state || "pending"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
