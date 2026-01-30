"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  CircleCheckBig,
  Clock,
  Search,
  ChevronDown,
  Filter,
  Eye,
} from "lucide-react";

// 타입 정의
interface QnAItem {
  id: number;
  question: string;
  author: string;
  createdAt: string;
  views: number;
  status: "answered" | "pending";
}

interface ProductInfo {
  name: string;
  sku: string;
  price: number;
  imageUrl: string;
}

// 목데이터
const productInfo: ProductInfo = {
  name: "Wireless Headphones Pro",
  sku: "WH-PRO-001",
  price: 299000,
  imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
};

const qnaData: QnAItem[] = [
  {
    id: 1,
    question: "배터리 수명이 얼마나 되나요?",
    author: "김철수",
    createdAt: "2026-01-14",
    views: 45,
    status: "answered",
  },
  {
    id: 2,
    question: "iPhone과 호환되나요?",
    author: "이영희",
    createdAt: "2026-01-13",
    views: 78,
    status: "answered",
  },
  {
    id: 3,
    question: "노이즈 캔슬링 기능이 있나요?",
    author: "박민수",
    createdAt: "2026-01-13",
    views: 32,
    status: "pending",
  },
  {
    id: 4,
    question: "방수 기능이 있나요?",
    author: "최지은",
    createdAt: "2026-01-12",
    views: 56,
    status: "answered",
  },
  {
    id: 5,
    question: "보증 기간은 얼마나 되나요?",
    author: "정현우",
    createdAt: "2026-01-12",
    views: 23,
    status: "pending",
  },
  {
    id: 6,
    question: "케이스가 포함되어 있나요?",
    author: "강수진",
    createdAt: "2026-01-11",
    views: 89,
    status: "answered",
  },
  {
    id: 7,
    question: "색상 옵션이 어떻게 되나요?",
    author: "윤서연",
    createdAt: "2026-01-11",
    views: 41,
    status: "pending",
  },
  {
    id: 8,
    question: "유선 연결도 가능한가요?",
    author: "임동현",
    createdAt: "2026-01-10",
    views: 67,
    status: "answered",
  },
];

// 통계 카드 컴포넌트
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

function StatCard({ label, value, icon, bgColor, textColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 ${bgColor} rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}

// 상태 배지 컴포넌트
interface StatusBadgeProps {
  status: "answered" | "pending";
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "answered") {
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
export default function ProductQnAPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "answered" | "pending">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 통계 계산
  const totalQuestions = qnaData.length;
  const answeredCount = qnaData.filter((q) => q.status === "answered").length;
  const pendingCount = qnaData.filter((q) => q.status === "pending").length;

  // 필터링된 데이터
  const filteredData = qnaData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 가격 포맷
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  return (
    <>
      {/* 타이틀 */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">제품 목록</h1>
            <p className="mt-1 text-sm text-gray-600">제품에 대한 정보를 관리하세요</p>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="전체 문의"
          value={totalQuestions}
          icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-100"
          textColor="text-gray-900"
        />
        <StatCard
          label="답변 완료"
          value={answeredCount}
          icon={<CircleCheckBig className="w-6 h-6 text-green-600" />}
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          label="답변 대기"
          value={pendingCount}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />
      </div>

      {/* Q&A 테이블 */}
      <div className="bg-white rounded-lg shadow">
        {/* 필터 영역 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 입력 */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="질문 또는 작성자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 상태 필터 */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "answered" | "pending")}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체 상태</option>
                <option value="answered">답변 완료</option>
                <option value="pending">답변 대기</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* 필터 버튼 */}
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-gray-700">필터</span>
            </button>
          </div>
        </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  조회수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="truncate">{item.question}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-gray-400 mr-1" />
                      {item.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                      <span className="mr-1">상세보기</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">총 {filteredData.length}개의 문의</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              이전
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === 1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === 2
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
