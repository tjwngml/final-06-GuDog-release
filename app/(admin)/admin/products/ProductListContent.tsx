"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Package, AlertTriangle, XCircle, Pencil } from "lucide-react";
import { getProducts } from "@/lib/product";
import { Product } from "@/types/product";
import StatCard from "@/app/(admin)/admin/_components/StatCard";
import SearchFilter from "@/app/(admin)/admin/_components/SearchFilter";
import Pagination from "@/app/(admin)/admin/_components/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useUrlParams } from "@/hooks/useUrlParams";
import Link from "next/link";

export default function ProductListContent() {
  const searchParams = useSearchParams();

  // 검색 입력 상태
  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || "");

  // URL 파라미터에서 현재 값 읽기
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || '{"createdAt":-1}';

  // 상품 목록 조회
  const { data: resProducts, isLoading } = useQuery({
    queryKey: ["admin", "products", keyword, category, page, sort],
    queryFn: () =>
      getProducts({
        keyword: keyword || undefined,
        custom: category !== "all" ? { "extra.type": category } : undefined,
        page,
        limit: 10,
        sort: JSON.parse(sort),
        showSoldOut: true,
      }),
  });

  // 통계 조회
  const { data: statsData } = useQuery({
    queryKey: ["productStats"],
    queryFn: () =>
      getProducts({
        limit: 9999,
        showSoldOut: true,
      }),
  });

  // 데이터 사용
  const products = resProducts?.ok === 1 ? resProducts.item : [];
  const pagination = resProducts?.ok === 1 ? resProducts.pagination : undefined;

  const stats = statsData?.ok
    ? {
        total: statsData.pagination.total,
        lowStock: statsData.item.filter(
          (p: Product) => p.quantity - p.buyQuantity > 0 && p.quantity - p.buyQuantity <= 100,
        ).length,
        outOfStock: statsData.item.filter((p: Product) => p.quantity - p.buyQuantity === 0).length,
      }
    : { total: 0, lowStock: 0, outOfStock: 0 };

  const { updateParams, getParam } = useUrlParams();

  // 검색 핸들러
  const handleSearch = () => {
    updateParams({ keyword: searchInput, page: "1" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 상태 필터 변경 핸들러
  const handleCategoryChange = (value: string) => {
    updateParams({ category: value === "all" ? "" : value, page: "1" });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  // 조회 순서 핸들러
  const handleSortChange = (value: string) => {
    updateParams({ sort: value, page: "1" });
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  // 필터 옵션
  const filterOptions = [
    { value: "all", label: "전체 카테고리" },
    { value: "사료", label: "사료" },
    { value: "간식", label: "간식" },
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: '{"createdAt":-1}', label: "최신순" },
    { value: '{"name":1}', label: "상품명 오름차순" },
    { value: '{"name":-1}', label: "상품명 내림차순" },
    { value: '{"extra.code":1}', label: "코드명 오름차순" },
    { value: '{"extra.code":-1}', label: "코드명 내림차순" },
    { value: '{"quantity":1}', label: "재고 적은순" },
    { value: '{"quantity":-1}', label: "재고 많은순" },
    { value: '{"price":1}', label: "가격 높은순" },
    { value: '{"price":-1}', label: "가격 낮은순" },
  ];

  return (
    <>
      {/* 타이틀 */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">상품 목록</h1>
            <p className="mt-1 text-sm text-gray-600">등록된 상품을 관리하세요</p>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="전체 상품"
          value={stats.total}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-100"
          textColor="text-gray-900"
        />
        <StatCard
          label="재고 100개 이하"
          value={stats.lowStock}
          icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />
        <StatCard
          label="재고 없음"
          value={stats.outOfStock}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          bgColor="bg-red-100"
          textColor="text-red-600"
        />
      </div>

      {/* 상품 테이블 */}
      <div className="bg-white rounded-lg shadow">
        {/* 검색/필터 영역 */}
        <SearchFilter
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
          searchPlaceholder="상품명 검색..."
          filterValue={category}
          onFilterChange={handleCategoryChange}
          filterOptions={filterOptions}
          sortValue={sort}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
        />

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품명
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  종류
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  코드명
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  재고
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    상품이 없습니다.
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  const stock = item.quantity - item.buyQuantity;
                  const getStockStyle = () => {
                    if (stock === 0) return "bg-red-100 text-red-600";
                    if (stock <= 10) return "bg-orange-100 text-orange-600";
                    return "bg-green-100 text-green-600";
                  };

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{item._id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex justify-center items-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              item.extra?.type === "사료"
                                ? "bg-blue-100 text-blue-600"
                                : item.extra?.type === "간식"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.extra?.type || "미분류"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {item.extra?.code || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStockStyle()}`}
                        >
                          {stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <Link
                          href={`/admin/products/${item._id}/modify`}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center px-3 py-1.5 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          <span>수정</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={page}
          totalPages={pagination?.totalPages || 1}
          totalCount={pagination?.total || 0}
          onPageChange={handlePageChange}
          label="개의 상품"
        />
      </div>
    </>
  );
}
