"use client";

import { useRef, useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import { INITIAL_PRODUCT_FORM, OPTIONS, ProductFormExtra, ProductFormState } from "@/types/product";
import { createProduct } from "@/actions/Createproduct";

// ===== 타입 =====
type ProductType = "사료" | "간식";

interface ImageFile {
  file: File;
  preview: string;
}

// ===== 유틸리티 =====
function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function toggleArray<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

// ===== UI 서브 컴포넌트 =====
function CheckboxPill({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer",
        checked
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      )}
    >
      {label}
    </button>
  );
}

function RadioPill({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer",
        selected
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      )}
    >
      {label}
    </button>
  );
}

// ===== 메인 컴포넌트 =====
export default function ProductCreatePage() {
  const [form, setForm] = useState<ProductFormState>(INITIAL_PRODUCT_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 상태
  const [thumbnail, setThumbnail] = useState<ImageFile | null>(null);
  const [detailImages, setDetailImages] = useState<ImageFile[]>([]);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const detailImagesInputRef = useRef<HTMLInputElement>(null);

  const productType = form.extra.type;

  // --- 타입 전환 ---
  const handleTypeChange = (type: ProductType) => {
    setForm({
      ...INITIAL_PRODUCT_FORM,
      extra: { ...INITIAL_PRODUCT_FORM.extra, type },
    });
    setThumbnail(null);
    setDetailImages([]);
    setError(null);
  };

  // --- 루트 필드 핸들러 ---
  const handleRootText = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRootNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
  };

  // --- extra 필드 핸들러 ---
  const updateExtra = (patch: Partial<ProductFormExtra>) => {
    setForm((prev) => ({ ...prev, extra: { ...prev.extra, ...patch } }));
  };

  const handleExtraText = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    updateExtra({ [name]: value });
  };

  const handleExtraNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateExtra({ [name]: value === "" ? "" : Number(value) });
  };

  const handleExtraToggle = (key: keyof ProductFormExtra, value: string) => {
    setForm((prev) => ({
      ...prev,
      extra: {
        ...prev.extra,
        [key]: toggleArray(prev.extra[key] as string[], value),
      },
    }));
  };

  // --- 썸네일 핸들러 ---
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (thumbnail?.preview) URL.revokeObjectURL(thumbnail.preview);
      setThumbnail({ file, preview: URL.createObjectURL(file) });
    }
  };

  const removeThumbnail = () => {
    if (thumbnail?.preview) URL.revokeObjectURL(thumbnail.preview);
    setThumbnail(null);
  };

  // --- 상세 이미지 핸들러 ---
  const handleDetailImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ImageFile[] = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setDetailImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeDetailImage = (index: number) => {
    setDetailImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  // --- 검증 ---
  const validate = () => {
    const { extra } = form;

    if (!form.name.trim()) throw new Error("상품명을 입력하세요.");
    if (form.price === "" || form.price < 0) throw new Error("가격을 올바르게 입력하세요.");
    if (form.quantity === "" || form.quantity < 0)
      throw new Error("재고 수량을 올바르게 입력하세요.");
    if (extra.weight === "" || extra.weight <= 0) throw new Error("용량을 올바르게 입력하세요.");
    if (!form.extra.content.trim()) throw new Error("상품 설명을 입력하세요.");
    if (!thumbnail) throw new Error("썸네일 이미지를 등록하세요.");
    if (detailImages.length === 0) throw new Error("상세 이미지를 최소 1개 등록하세요.");

    if (productType === "사료") {
      if (extra.lifeStage.length === 0) throw new Error("라이프스테이지를 최소 1개 선택하세요.");
      if (extra.size.length === 0) throw new Error("견종 크기를 최소 1개 선택하세요.");
      if (extra.mainProtein.length === 0) throw new Error("주 단백질을 최소 1개 선택하세요.");
      if (form.extra.kcalPer100g === "" || form.extra.kcalPer100g < 0)
        throw new Error("100g당 칼로리를 입력하세요.");
      if (form.extra.nutriProtein === "" || form.extra.nutriProtein < 0)
        throw new Error("조단백을 입력하세요.");
      if (form.extra.nutriFat === "" || form.extra.nutriFat < 0)
        throw new Error("조지방을 입력하세요.");
      if (form.extra.nutriMoisture === "" || form.extra.nutriMoisture < 0)
        throw new Error("수분을 입력하세요.");
    }
  };

  // --- 제출 ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      validate();

      setIsSubmitting(true);

      const result = await createProduct(
        form,
        thumbnail!.file,
        detailImages.map((img) => img.file),
      );

      console.log("등록 완료:", result);
      alert("상품이 등록되었습니다.");

      // TODO: 등록 후 이동 (예: router.push)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              type="button"
              className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">상품 등록</h1>
              <p className="mt-1 text-sm text-gray-600">사료 추천 시스템용 상품 데이터 등록</p>
            </div>
          </div>

          {/* 사료 / 간식 탭 */}
          <div className="flex gap-2">
            {(["사료", "간식"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={cx(
                  "px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  productType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ========== 왼쪽: 데이터 입력 영역 (2칸) ========== */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. 기본 정보 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상품명 *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleRootText}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="예: 스몰퍼피 치킨앤라이스"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">가격 *</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="price"
                          required
                          min={0}
                          value={form.price}
                          onChange={handleRootNumber}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          원
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        재고 수량 *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        required
                        min={0}
                        value={form.quantity}
                        onChange={handleRootNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="예: 120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        용량(g) *
                      </label>
                      <input
                        type="number"
                        name="weight"
                        required
                        min={1}
                        value={form.extra.weight}
                        onChange={handleExtraNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="예: 600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상품 설명 *
                    </label>
                    <textarea
                      name="content"
                      required
                      value={form.extra.content}
                      onChange={handleExtraText}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                      placeholder="추천 이유 및 특징"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      라인 태그 (관리용)
                    </label>
                    <select
                      name="lineTag"
                      value={form.extra.lineTag}
                      onChange={handleExtraText}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {OPTIONS.lineTag.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. 상세 이미지 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 이미지 *</h2>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => detailImagesInputRef.current?.click()}
                  >
                    <input
                      ref={detailImagesInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleDetailImagesChange}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-blue-600 font-medium">클릭하여 업로드</span>
                    </p>
                    <p className="text-xs text-gray-500">상세 설명에 들어갈 이미지들</p>
                  </div>

                  {detailImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {detailImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Detail ${index}`}
                            className="w-full h-30 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeDetailImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="mt-1 text-[10px] text-gray-500 truncate px-1">
                            {image.file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. 매칭 정보 (사료 전용) */}
              {productType === "사료" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">매칭 정보 (extra)</h2>
                  <div className="space-y-6">
                    {/* 타겟 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">라이프스테이지 *</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.lifeStage.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.lifeStage.includes(v)}
                              onClick={() => handleExtraToggle("lifeStage", v)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">견종 크기 *</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.size.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.size.includes(v)}
                              onClick={() => handleExtraToggle("size", v)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">중성화</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.neutered.map((o) => (
                            <RadioPill
                              key={o.value}
                              label={o.label}
                              selected={form.extra.neutered === o.value}
                              onClick={() => updateExtra({ neutered: o.value })}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">추천 체형</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.bodyType.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.bodyType.includes(v)}
                              onClick={() => handleExtraToggle("bodyType", v)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">추천 활동량</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.activityLevel.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.activityLevel.includes(v)}
                              onClick={() => handleExtraToggle("activityLevel", v)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 원료 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">주 단백질 *</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.mainProtein.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.mainProtein.includes(v)}
                              onClick={() => handleExtraToggle("mainProtein", v)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">그레인프리</p>
                        <div className="flex flex-wrap gap-2">
                          <RadioPill
                            label="그레인프리"
                            selected={form.extra.grainFree === true}
                            onClick={() => updateExtra({ grainFree: true })}
                          />
                          <RadioPill
                            label="곡물 포함"
                            selected={form.extra.grainFree === false}
                            onClick={() => updateExtra({ grainFree: false })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 기능 / 칼로리 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">기능성</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.healthBenefits.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.healthBenefits.includes(v)}
                              onClick={() => handleExtraToggle("healthBenefits", v)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          100g당 칼로리(kcal) *
                        </label>
                        <input
                          type="number"
                          name="kcalPer100g"
                          min={1}
                          value={form.extra.kcalPer100g}
                          onChange={handleExtraNumber}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 포함/제외 원료 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">포함 원료</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.ingredientsContains.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.ingredientsContains.includes(v)}
                              onClick={() => handleExtraToggle("ingredientsContains", v)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">제외 원료</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.ingredientsAvoid.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.ingredientsAvoid.includes(v)}
                              onClick={() => handleExtraToggle("ingredientsAvoid", v)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 제외 조건 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2 text-red-600">
                          알러지 제외
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.avoidAllergies.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.avoidAllergies.includes(v)}
                              onClick={() => handleExtraToggle("avoidAllergies", v)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2 text-red-600">
                          질환 제외
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.avoidDiseases.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.avoidDiseases.includes(v)}
                              onClick={() => handleExtraToggle("avoidDiseases", v)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 특징 태그 + 영양성분 */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">특징 태그</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {OPTIONS.specialFeatures.map((v) => (
                          <CheckboxPill
                            key={v}
                            label={v}
                            checked={form.extra.specialFeatures.includes(v)}
                            onClick={() => handleExtraToggle("specialFeatures", v)}
                          />
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <label className="text-xs text-gray-500 mb-1 block">조단백(%) *</label>
                          <input
                            type="number"
                            name="nutriProtein"
                            value={form.extra.nutriProtein}
                            onChange={handleExtraNumber}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div className="w-1/3">
                          <label className="text-xs text-gray-500 mb-1 block">조지방(%) *</label>
                          <input
                            type="number"
                            name="nutriFat"
                            value={form.extra.nutriFat}
                            onChange={handleExtraNumber}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div className="w-1/3">
                          <label className="text-xs text-gray-500 mb-1 block">수분(%) *</label>
                          <input
                            type="number"
                            name="nutriMoisture"
                            value={form.extra.nutriMoisture}
                            onChange={handleExtraNumber}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ========== 오른쪽: 썸네일 & 액션 (1칸) ========== */}
            <div className="lg:col-span-1 space-y-6">
              {/* 썸네일 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">썸네일 (mainImages) *</h2>
                <div className="space-y-4">
                  {thumbnail ? (
                    <div className="relative">
                      <img
                        src={thumbnail.preview}
                        alt="Thumbnail"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="mt-2 text-xs text-gray-600 truncate">{thumbnail.file.name}</p>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="text-blue-600 font-medium">클릭하여 업로드</span>
                      </p>
                      <p className="text-xs text-gray-500">목록에 표시될 대표 이미지</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="bg-white rounded-lg shadow p-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cx(
                    "w-full inline-flex items-center justify-center px-4 py-2 rounded-lg transition-colors cursor-pointer",
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSubmitting ? "등록 중..." : `${productType} 등록`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
