"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, CircleCheckBig, Clock, ChevronRight } from "lucide-react";
import StatCard from "@/app/(admin)/admin/_components/StatCard";
import SearchFilter from "@/app/(admin)/admin/_components/SearchFilter";
import Pagination from "@/app/(admin)/admin/_components/Pagination";
import { getPosts } from "@/lib/post";
import { useQuery } from "@tanstack/react-query";
import { useUrlParams } from "@/hooks/useUrlParams";
import Link from "next/link";

// 상태 뱃지 컴포넌트
interface StatusBadgeProps {
  status: boolean;
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <CircleCheckBig className="w-3 h-3 mr-1" />
        답변 완료
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
      <Clock className="w-3 h-3 mr-1" />
      답변 대기
    </span>
  );
}

// 메인 페이지 컴포넌트
export default function QnAListPage() {
  const searchParams = useSearchParams();

  // 검색 입력 상태
  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || "");

  // URL 파라미터에서 현재 값 읽기
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || '{"createdAt":-1}';

  // QnA 목록 조회
  const { data: resQnas, isLoading } = useQuery({
    queryKey: ["admin", "qna", keyword, status, page, sort],
    queryFn: () => {
      let custom: Record<string, unknown> | undefined;
      if (status === "answered") {
        custom = { "replies.0": { $exists: true } };
      } else if (status === "pending") {
        custom = { "replies.0": { $exists: false } };
      }

      return getPosts({
        boardType: "qna",
        keyword: keyword || undefined,
        page,
        custom,
        limit: 10,
        sort: JSON.parse(sort),
      });
    },
  });

  // 통계 조회
  const { data: statsData } = useQuery({
    queryKey: ["productStats"],
    queryFn: () =>
      getPosts({
        boardType: "qna",
        limit: 9999,
      }),
  });

  // 데이터 사용
  const qnas = resQnas?.ok === 1 ? resQnas.item : [];
  const pagination = resQnas?.ok === 1 ? resQnas.pagination : undefined;

  const stats = statsData?.ok
    ? {
        total: statsData.pagination.total,
        answered: statsData.item.filter((q) => (q.repliesCount ?? 0) > 0).length,
        pending: statsData.item.filter((q) => (q.repliesCount ?? 0) === 0).length,
      }
    : { total: 0, answered: 0, pending: 0 };

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
  const handleStatusChange = (value: string) => {
    updateParams({ status: value === "all" ? "" : value, page: "1" });
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
    { value: "all", label: "전체 상태" },
    { value: "answered", label: "답변 완료" },
    { value: "pending", label: "답변 대기" },
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: '{"createdAt":-1}', label: "최신순" },
    { value: '{"title":1}', label: "질문명 오름차순" },
    { value: '{"title":-1}', label: "질문명 내림차순" },
  ];

  return (
    <>
      {/* 타이틀 */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Q&A 목록</h1>
            <p className="mt-1 text-sm text-gray-600">고객 문의 사항을 관리하세요</p>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="전체 문의"
          value={stats.total}
          icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-100"
          textColor="text-gray-900"
        />
        <StatCard
          label="답변 완료"
          value={stats.answered}
          icon={<CircleCheckBig className="w-6 h-6 text-green-600" />}
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          label="답변 대기"
          value={stats.pending}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />
      </div>

      {/* Q&A 테이블 */}
      <div className="bg-white rounded-lg shadow">
        {/* 검색/필터 영역 */}
        <SearchFilter
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
          searchPlaceholder="질문 검색"
          filterValue={status}
          onFilterChange={handleStatusChange}
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
                  질문
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : qnas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    문의가 없습니다.
                  </td>
                </tr>
              ) : (
                qnas.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{item._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {item.user?.name || "익명"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={(item.repliesCount ?? 0) > 0} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <Link
                        href={`/admin/qna/${item._id}/answer`}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <span>{(item.repliesCount ?? 0) > 0 ? "답변수정하기" : "답변하기"}</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))
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
          label="개 문의"
        />
      </div>
    </>
  );
}
