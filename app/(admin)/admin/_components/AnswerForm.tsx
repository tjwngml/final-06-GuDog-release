"use client";

import { Post, Product } from "@/types";
import { useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Trash2, User, Calendar, Save, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { deletePost, deleteReply, saveReply } from "@/actions/qna";
import { showSuccess, showError } from "@/lib";

// ===== Props 타입 =====
interface AnswerFormProps {
  postId: string | number;
  questionData: Post;
  productData: Product;
}

// 빠른 답변 템플릿
const quickTemplates = [
  {
    id: "normal",
    label: "일반 문의",
    content:
      "안녕하세요, 고객님.\n\n문의 주셔서 감사합니다.\n\n[답변 입력]\n\n추가 문의 사항이 있으시면 언제든지 문의해 주세요.\n감사합니다.",
  },
  {
    id: "light",
    label: "경미한 불편",
    content:
      "안녕하세요, 고객님.\n\n문의 주셔서 감사합니다.\n\n안내가 충분하지 못했던 점 양해 부탁드립니다.\n\n[답변 입력]\n\n감사합니다.",
  },
  {
    id: "claim",
    label: "불편/클레임",
    content:
      "안녕하세요, 고객님.\n\n이용에 불편을 드려 진심으로 죄송합니다.\n\n[조치 내용 입력]\n\n최선을 다해 도와드리겠습니다.\n감사합니다.",
  },
];

export default function AnswerForm({ postId, questionData, productData }: AnswerFormProps) {
  const router = useRouter();

  // 기존 답변 (replies[0])
  const existingReply = questionData.replies?.[0];
  const isModifyMode = !!existingReply;

  // 상태
  const [answer, setAnswer] = useState(existingReply?.content || "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<"post" | "reply">("post");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 1000;

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

  // 답변 등록/수정
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsSubmitting(true);
    try {
      await saveReply(postId, { content: answer }, isModifyMode ? existingReply._id : undefined);

      showSuccess("완료", isModifyMode ? "답변이 수정되었습니다." : "답변이 등록되었습니다.");
      router.push("/admin/qna");
    } catch (error) {
      showError("오류", error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제 모달 열기
  const openDeleteModal = (type: "post" | "reply") => {
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  // 삭제 처리
  const handleDelete = async () => {
    try {
      if (deleteType === "post") {
        await deletePost(postId);
        showSuccess("삭제 완료", "질문이 삭제되었습니다.");
      } else if (existingReply) {
        await deleteReply(postId, existingReply._id);
        showSuccess("삭제 완료", "답변이 삭제되었습니다.");
      }
      router.push("/admin/qna");
    } catch (error) {
      showError("삭제 실패", error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  // 상품 상세보기
  const handleViewProduct = () => {
    router.push(`/products/${productData._id}`);
  };

  return (
    <>
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
                <h1 className="text-3xl font-semibold text-gray-900">
                  Q&amp;A 답변 {isModifyMode ? "수정" : "등록"}
                </h1>
                <p className="mt-1 text-sm text-gray-600">고객 문의에 답변해주세요</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isModifyMode && (
                <button
                  type="button"
                  onClick={() => openDeleteModal("reply")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  title="답변 삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              {/* <button
                type="button"
                onClick={() => openDeleteModal("post")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="질문 삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button> */}
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
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    isModifyMode ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {isModifyMode ? "답변 완료" : "답변 대기"}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">{questionData.title}</h3>
                <p className="text-gray-900 leading-relaxed mb-4">{questionData.content}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    <span>{questionData.user?.name || "익명"}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>{questionData.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 답변 작성 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                답변 {isModifyMode ? "수정" : "작성"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* 답변 내용 */}
                  <div>
                    <label
                      htmlFor="answer"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                      {isSubmitting ? "처리 중..." : isModifyMode ? "답변 수정" : "답변 등록"}
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
                  src={productData.mainImages?.[0]?.path || "/images/no-image.png"}
                  alt={productData.name}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{productData.name}</h3>
                  {productData.extra?.code && (
                    <p className="text-sm text-gray-500 mt-1">{productData.extra.code}</p>
                  )}
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    {formatPrice(productData.price)}
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
                  <p className="text-sm font-medium text-gray-900">
                    {questionData.user?.name || "익명"}
                  </p>
                </div>
                {/* {questionData.user?.email && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">이메일</p>
                    <p className="text-sm font-medium text-gray-900">{questionData.user.email}</p>
                  </div>
                )} */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">문의 번호</p>
                  <p className="text-sm font-medium text-gray-900">
                    #{String(questionData._id).padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">문의 일시</p>
                  <p className="text-sm font-medium text-gray-900">{questionData.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {deleteType === "post" ? "질문 삭제" : "답변 삭제"}
              </h3>
              <p className="text-gray-600 mb-6">
                {deleteType === "post"
                  ? "정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                  : "정말로 이 답변을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."}
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
    </>
  );
}
