"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Trash2, User, Calendar, Eye, Save, Send, MessageCircle } from "lucide-react";

// 타입 정의
interface QnADetail {
  id: number;
  question: string;
  author: string;
  email: string;
  createdAt: string;
  views: number;
  status: "pending" | "answered";
  answer?: string;
}

interface ProductInfo {
  id: string;
  name: string;
  sku: string;
  price: number;
  imageUrl: string;
}

// 빠른 답변 템플릿
const quickTemplates = [
  {
    id: "feature",
    label: "기능 지원",
    content:
      "안녕하세요, 고객님. 문의하신 기능에 대해 안내드립니다.\n\n해당 기능은 저희 제품에서 지원되고 있습니다. 자세한 사용 방법은 제품 설명서를 참고해 주시기 바랍니다.\n\n추가 문의 사항이 있으시면 언제든지 연락 주세요. 감사합니다.",
  },
  {
    id: "spec",
    label: "사양 안내",
    content:
      "안녕하세요, 고객님. 제품 사양에 대해 안내드립니다.\n\n문의하신 내용에 대한 상세 사양은 다음과 같습니다:\n- \n\n추가 문의 사항이 있으시면 언제든지 연락 주세요. 감사합니다.",
  },
  {
    id: "shipping",
    label: "배송 안내",
    content:
      "안녕하세요, 고객님. 배송에 대해 안내드립니다.\n\n주문하신 상품은 결제 완료 후 1-3일 내에 출고됩니다. 출고 후 1-2일 내에 수령하실 수 있습니다.\n\n추가 문의 사항이 있으시면 언제든지 연락 주세요. 감사합니다.",
  },
];

// 목데이터
const mockQnAData: QnADetail = {
  id: 3,
  question: "노이즈 캔슬링 기능이 있나요? 주변 소음이 많은 환경에서도 사용할 수 있을까요?",
  author: "박민수",
  email: "minsu.park@example.com",
  createdAt: "2026-01-13 14:35",
  views: 32,
  status: "pending",
};

const mockProductInfo: ProductInfo = {
  id: "1",
  name: "Wireless Headphones Pro",
  sku: "WH-PRO-001",
  price: 299000,
  imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
};

// Props 타입
interface QnAAnswerPageProps {
  qnaId?: number;
}

export default function QnAAnswerPage({ qnaId }: QnAAnswerPageProps) {
  // 상태
  const [qnaData, setQnAData] = useState<QnADetail | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"pending" | "answered">("pending");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 1000;

  // 초기 데이터 로드
  useEffect(() => {
    // TODO: 실제로는 qnaId를 사용하여 API 호출
    setQnAData(mockQnAData);
    setProductInfo(mockProductInfo);
    setStatus(mockQnAData.status);
    if (mockQnAData.answer) {
      setAnswer(mockQnAData.answer);
    }
  }, [qnaId]);

  // 가격 포맷
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  // 답변 입력 핸들러
  const handleAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setAnswer(value);
    }
  };

  // 템플릿 적용
  const applyTemplate = (templateId: string) => {
    const template = quickTemplates.find((t) => t.id === templateId);
    if (template) {
      setAnswer(template.content);
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as "pending" | "answered");
  };

  // 답변 등록
  const handleSubmit = async (e: FormEvent, sendEmail: boolean = false) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsSubmitting(true);
    try {
      console.log("Submit answer:", {
        qnaId,
        answer,
        status,
        sendEmail,
      });
      // TODO: API 호출
      setStatus("answered");
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 질문 삭제
  const handleDelete = () => {
    console.log("Delete QnA:", qnaId);
    // TODO: API 호출 후 목록 페이지로 이동
    setShowDeleteModal(false);
  };

  // 뒤로가기
  const handleBack = () => {
    // TODO: 라우터 연동
    console.log("Navigate back");
  };

  // 상품 상세보기
  const handleViewProduct = () => {
    // TODO: 라우터 연동
    console.log("View product:", productInfo?.id);
  };

  // 미리보기
  const handlePreview = () => {
    // TODO: 미리보기 모달
    console.log("Preview answer");
  };

  // 이메일 보내기
  const handleSendEmail = () => {
    // TODO: 이메일 발송 모달
    console.log("Send email to:", qnaData?.email);
  };

  if (!qnaData || !productInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleBack}
              className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Q&amp;A 답변</h1>
              <p className="mt-1 text-sm text-gray-600">고객 문의에 답변해주세요</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 질문 내용 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">질문 내용</h2>
              <div className="flex items-center gap-2">
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                    status === "answered"
                      ? "bg-green-100 text-green-700 border-green-200 focus:ring-green-500"
                      : "bg-orange-100 text-orange-700 border-orange-200 focus:ring-orange-500"
                  }`}
                >
                  <option value="pending">답변 대기</option>
                  <option value="answered">답변 완료</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 leading-relaxed mb-4">{qnaData.question}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1.5" />
                  <span>{qnaData.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>{qnaData.createdAt}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1.5" />
                  <span>조회 {qnaData.views}회</span>
                </div>
              </div>
            </div>
          </div>

          {/* 답변 작성 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">답변 작성</h2>
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <div className="space-y-4">
                {/* 답변 내용 */}
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                    답변 내용 *
                  </label>
                  <textarea
                    id="answer"
                    required
                    rows={8}
                    placeholder="고객의 질문에 대한 답변을 작성해주세요..."
                    value={answer}
                    onChange={handleAnswerChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {answer.length} / {maxLength}자
                  </p>
                </div>

                {/* 빠른 답변 템플릿 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">빠른 답변 템플릿</p>
                  <div className="flex flex-wrap gap-2">
                    {quickTemplates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => applyTemplate(template.id)}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !answer.trim()}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    답변 등록
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as any, true)}
                    disabled={isSubmitting || !answer.trim()}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    등록 및 이메일 발송
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 답변 작성 가이드 */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              답변 작성 가이드
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>명확하고 정확한 정보를 제공해주세요.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>친절하고 정중한 어조를 유지해주세요.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>필요한 경우 추가 자료나 링크를 포함해주세요.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>답변 등록 시 고객에게 자동으로 이메일이 발송됩니다.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 상품 정보 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">상품 정보</h2>
            <div className="space-y-4">
              <img
                src={productInfo.imageUrl}
                alt={productInfo.name}
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <div>
                <h3 className="font-medium text-gray-900">{productInfo.name}</h3>
                <p className="text-sm text-gray-500 mt-1">SKU: {productInfo.sku}</p>
                <p className="text-lg font-semibold text-blue-600 mt-2">
                  {formatPrice(productInfo.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleViewProduct}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                상품 상세보기
              </button>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">이름</p>
                <p className="text-sm font-medium text-gray-900">{qnaData.author}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">이메일</p>
                <p className="text-sm font-medium text-gray-900">{qnaData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">문의 번호</p>
                <p className="text-sm font-medium text-gray-900">
                  #{String(qnaData.id).padStart(4, "0")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">문의 일시</p>
                <p className="text-sm font-medium text-gray-900">{qnaData.createdAt}</p>
              </div>
            </div>
          </div>

          {/* 추가 작업 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">추가 작업</h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handlePreview}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Eye className="w-4 h-4 inline mr-2" />
                미리보기
              </button>
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                고객에게 이메일 보내기
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                질문 삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">질문 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
