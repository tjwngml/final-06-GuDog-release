"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { ArrowLeft, Plus, X, Upload, Save, Eye, Trash2 } from "lucide-react";

// 타입 정의
interface ProductFormData {
  name: string;
  type: string;
  tags: string[];
  price: string;
}

interface ImageFile {
  id: string;
  url: string;
  isNew?: boolean;
  file?: File;
}

interface ProductData {
  id: string;
  name: string;
  type: string;
  tags: string[];
  price: number;
  thumbnailUrl: string;
  contentImages: string[];
}

// 상품 타입 옵션
const productTypes = [
  { value: "Electronics", label: "전자기기" },
  { value: "Fashion", label: "패션" },
  { value: "Food", label: "식품" },
  { value: "Beauty", label: "뷰티" },
  { value: "Sports", label: "스포츠" },
  { value: "Books", label: "도서" },
  { value: "Home", label: "홈/리빙" },
  { value: "Toys", label: "장난감" },
];

// 목데이터 (실제로는 API에서 가져옴)
const mockProductData: ProductData = {
  id: "1",
  name: "Wireless Headphones Pro",
  type: "Electronics",
  tags: ["전자기기", "오디오", "블루투스", "프리미엄"],
  price: 299000,
  thumbnailUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  contentImages: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=400&fit=crop",
  ],
};

// Props 타입
interface ProductEditPageProps {
  productId?: string;
}

export default function ProductEditPage({ productId }: ProductEditPageProps) {
  // 폼 상태
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    type: "",
    tags: [],
    price: "",
  });

  // 태그 입력 상태
  const [tagInput, setTagInput] = useState("");

  // 이미지 상태
  const [thumbnail, setThumbnail] = useState<ImageFile | null>(null);
  const [contentImages, setContentImages] = useState<ImageFile[]>([]);

  // 삭제 확인 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 파일 input ref
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const contentImagesInputRef = useRef<HTMLInputElement>(null);

  // 초기 데이터 로드
  useEffect(() => {
    // TODO: 실제로는 productId를 사용하여 API 호출
    const data = mockProductData;

    setFormData({
      name: data.name,
      type: data.type,
      tags: data.tags,
      price: data.price.toString(),
    });

    setThumbnail({
      id: "thumb-1",
      url: data.thumbnailUrl,
      isNew: false,
    });

    setContentImages(
      data.contentImages.map((url, index) => ({
        id: `content-${index}`,
        url,
        isNew: false,
      })),
    );
  }, [productId]);

  // 입력 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 태그 추가
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  // 태그 입력 키 핸들러
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // 태그 삭제
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // 썸네일 업로드 핸들러
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnail({
        id: `thumb-new-${Date.now()}`,
        url,
        isNew: true,
        file,
      });
    }
  };

  // 본문 이미지 업로드 핸들러
  const handleContentImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ImageFile[] = Array.from(files).map((file, index) => ({
        id: `content-new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        isNew: true,
        file,
      }));
      setContentImages((prev) => [...prev, ...newImages]);
    }
  };

  // 본문 이미지 삭제
  const removeContentImage = (id: string) => {
    setContentImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove?.isNew && imageToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  // 썸네일 삭제
  const removeThumbnail = () => {
    if (thumbnail?.isNew && thumbnail.url.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnail.url);
    }
    setThumbnail(null);
  };

  // 폼 제출 (수정 완료)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", {
      ...formData,
      thumbnail,
      contentImages,
    });
    // TODO: API 호출
  };

  // 상품 삭제
  const handleDelete = () => {
    console.log("Delete product:", productId);
    // TODO: API 호출 후 목록 페이지로 이동
    setShowDeleteModal(false);
  };

  // 뒤로가기
  const handleBack = () => {
    // TODO: 라우터 연동
    console.log("Navigate back");
  };

  // 미리보기
  const handlePreview = () => {
    // TODO: 미리보기 모달 또는 페이지
    console.log("Preview product");
  };

  // 취소
  const handleCancel = () => {
    // TODO: 확인 모달 후 이동
    console.log("Cancel");
  };

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
              <h1 className="text-3xl font-semibold text-gray-900">상품 수정</h1>
              <p className="mt-1 text-sm text-gray-600">상품 정보를 수정해주세요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            상품 삭제
          </button>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 영역 - 기본 정보 & 본문 이미지 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
              <div className="space-y-4">
                {/* 상품명 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    상품명 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="상품명을 입력하세요"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 타입 */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    타입 *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">타입을 선택하세요</option>
                    {productTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 태그 */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    태그
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id="tags"
                      placeholder="태그를 입력하고 Enter를 누르세요"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-blue-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 가격 */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    가격 *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      step="1"
                      min="0"
                      placeholder="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      원
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 본문 이미지 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">본문 이미지</h2>
              <div className="space-y-4">
                {/* 업로드 영역 */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => contentImagesInputRef.current?.click()}
                >
                  <input
                    ref={contentImagesInputRef}
                    type="file"
                    id="contentImages"
                    accept="image/*"
                    multiple
                    onChange={handleContentImagesChange}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="text-blue-600 font-medium">클릭하여 업로드</span> 또는 드래그
                    앤 드롭
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                </div>

                {/* 업로드된 이미지 미리보기 */}
                {contentImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {contentImages.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`본문 이미지 ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeContentImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 영역 - 썸네일 & 버튼 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 썸네일 이미지 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">썸네일 이미지</h2>
              <div className="space-y-4">
                {thumbnail ? (
                  <div className="relative group">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-blue-600 font-medium">클릭하여 업로드</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                  </div>
                )}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5 mr-2" />
                  수정 완료
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  미리보기
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">상품 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
