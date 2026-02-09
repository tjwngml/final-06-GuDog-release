"use client";

import { useRef, useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import {
  OPTIONS,
  Product,
  ProductImage,
  ProductIngredients,
  ProductAvoidIf,
  ProductNutrition,
  Neutered,
  LifeStage,
  Size,
  MainProtein,
  BodyType,
  ActivityLevel,
  HealthBenefit,
  SpecialFeature,
  LineTag,
} from "@/types/product";
import { createProduct, updateProduct } from "@/actions/product";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ===== 폼 상태 타입 =====
interface ProductFormState {
  name: string;
  price: number | "";
  quantity: number | "";
  content: string;
  shippingFees: number;
  extra: ProductFormExtra;
}

interface ProductFormExtra {
  type: "사료" | "간식";
  code: string;
  weight: number | "";
  bodyType: BodyType[];
  activityLevel: ActivityLevel[];
  neutered: Neutered;
  grainFree: boolean;
  foodType: "건식" | "습식";
  healthBenefits: HealthBenefit[];
  ingredients: ProductIngredients;
  avoidIf: ProductAvoidIf;
  specialFeatures: SpecialFeature[];
  lineTag: LineTag;
  content: string;
  lifeStage: LifeStage[];
  size: Size[];
  mainProtein: MainProtein[];
  kcalPer100g: number | "";
  nutrition: ProductNutrition;
}

const INITIAL_PRODUCT_FORM: ProductFormState = {
  name: "",
  price: "",
  quantity: "",
  shippingFees: 0,
  content: "",
  extra: {
    type: "사료",
    code: "",
    weight: "",
    bodyType: [],
    activityLevel: [],
    neutered: "both",
    grainFree: false,
    foodType: "건식",
    healthBenefits: [],
    ingredients: { contains: [], avoid: [] },
    avoidIf: { allergies: [], diseases: [] },
    specialFeatures: [],
    lineTag: "",
    content: "",
    lifeStage: [],
    size: [],
    mainProtein: [],
    kcalPer100g: "",
    nutrition: { protein: 0, fat: 0, moisture: 0 },
  },
};

// Product → ProductFormState 변환 함수
function productToFormState(product: Product): ProductFormState {
  const { extra } = product;
  const isFood = extra.type === "사료";

  // 수정 시 실제 남은 재고 표시 (판매된 수량 제외)
  const displayQuantity = product.quantity - (product.buyQuantity ?? 0);

  return {
    name: product.name,
    price: product.price,
    quantity: displayQuantity,
    shippingFees: product.shippingFees,
    content: extra.content,
    extra: {
      type: extra.type,
      code: extra.code,
      weight: extra.weight,
      bodyType: extra.bodyType,
      activityLevel: extra.activityLevel,
      neutered: extra.neutered,
      grainFree: extra.grainFree,
      foodType: extra.foodType,
      healthBenefits: extra.healthBenefits,
      ingredients: extra.ingredients,
      avoidIf: extra.avoidIf,
      specialFeatures: extra.specialFeatures,
      lineTag: extra.lineTag,
      content: extra.content,
      lifeStage: isFood ? extra.lifeStage : [],
      size: isFood ? extra.size : [],
      mainProtein: isFood ? extra.mainProtein : [],
      kcalPer100g: isFood ? extra.kcalPer100g : "",
      nutrition: isFood ? extra.nutrition : { protein: 0, fat: 0, moisture: 0 },
    },
  };
}

// ===== 이미지 타입 =====
type ProductType = "사료" | "간식";

// 새로 업로드한 이미지
interface NewImageFile {
  type: "new";
  file: File;
  preview: string;
}

// 기존 서버 이미지
interface ExistingImage {
  type: "existing";
  data: ProductImage;
}

type ImageItem = NewImageFile | ExistingImage;

// ===== Props 타입 =====
interface ProductFormProps {
  formType: "create" | "modify";
  initialData?: Product;
}

// ===== 유틸리티 =====
function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function toggleArray<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function getImageUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_URL}${path}`;
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
export default function ProductForm({ formType, initialData }: ProductFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ProductFormState>(() =>
    initialData ? productToFormState(initialData) : INITIAL_PRODUCT_FORM,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // buyQuantity 저장 (수정 시 서버 전송용)
  const buyQuantity = initialData?.buyQuantity ?? 0;

  // 썸네일 상태 (기존 이미지 또는 새 파일)
  const [thumbnail, setThumbnail] = useState<ImageItem | null>(() => {
    if (initialData?.mainImages?.[0]) {
      return { type: "existing", data: initialData.mainImages[0] };
    }
    return null;
  });

  // 상세 이미지 상태 (기존 + 새 파일 혼합)
  const [detailImages, setDetailImages] = useState<ImageItem[]>(() => {
    if (initialData?.extra?.detailImages) {
      return initialData.extra.detailImages.map((img) => ({
        type: "existing" as const,
        data: img,
      }));
    }
    return [];
  });

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
    updateExtra({ [e.target.name]: e.target.value });
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

  const handleNestedToggle = <T extends "ingredients" | "avoidIf">(
    parent: T,
    field: T extends "ingredients" ? keyof ProductIngredients : keyof ProductAvoidIf,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      extra: {
        ...prev.extra,
        [parent]: {
          ...prev.extra[parent],
          [field]: toggleArray(
            prev.extra[parent][field as keyof (typeof prev.extra)[typeof parent]] as string[],
            value,
          ),
        },
      },
    }));
  };

  const handleNutritionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      extra: {
        ...prev.extra,
        nutrition: {
          ...prev.extra.nutrition,
          [name]: value === "" ? 0 : Number(value),
        },
      },
    }));
  };

  // --- 루트 & extra 일괄적용 핸들러 ---
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      content: value, // 루트 업데이트
      extra: {
        ...prev.extra,
        content: value, // extra도 동기화
      },
    }));
  };

  // --- 썸네일 핸들러 ---
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 기존 새 파일 프리뷰 정리
      if (thumbnail?.type === "new") {
        URL.revokeObjectURL(thumbnail.preview);
      }
      setThumbnail({
        type: "new",
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removeThumbnail = () => {
    if (thumbnail?.type === "new") {
      URL.revokeObjectURL(thumbnail.preview);
    }
    setThumbnail(null);
  };

  // --- 상세 이미지 핸들러 ---
  const handleDetailImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ImageItem[] = Array.from(files).map((file) => ({
        type: "new" as const,
        file,
        preview: URL.createObjectURL(file),
      }));
      setDetailImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeDetailImage = (index: number) => {
    setDetailImages((prev) => {
      const target = prev[index];
      if (target.type === "new") {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // --- 이미지 URL 가져오기 ---
  const getThumbnailSrc = (): string => {
    if (!thumbnail) return "";
    return thumbnail.type === "new" ? thumbnail.preview : getImageUrl(thumbnail.data.path);
  };

  const getDetailImageSrc = (item: ImageItem): string => {
    return item.type === "new" ? item.preview : getImageUrl(item.data.path);
  };

  const getDetailImageName = (item: ImageItem): string => {
    return item.type === "new" ? item.file.name : item.data.name;
  };

  // --- 검증 ---
  const validate = () => {
    const { extra } = form;
    console.log(form);

    if (!form.name.trim()) throw new Error("상품명을 입력하세요.");
    if (!form.extra.code.trim()) throw new Error("코드명을 입력하세요.");
    if (form.price === "" || form.price < 0) throw new Error("가격을 올바르게 입력하세요.");
    if (form.quantity === "" || form.quantity < 0)
      throw new Error("재고 수량을 올바르게 입력하세요.");
    if (extra.weight === "" || extra.weight <= 0) throw new Error("용량을 올바르게 입력하세요.");
    if (!extra.content.trim()) throw new Error("상품 설명을 입력하세요.");
    if (!thumbnail) throw new Error("썸네일 이미지를 등록하세요.");
    if (detailImages.length === 0) throw new Error("상세 이미지를 최소 1개 등록하세요.");

    if (productType === "사료") {
      if (extra.lifeStage.length === 0) throw new Error("라이프스테이지를 최소 1개 선택하세요.");
      if (extra.size.length === 0) throw new Error("견종 크기를 최소 1개 선택하세요.");
      if (extra.mainProtein.length === 0) throw new Error("주 단백질을 최소 1개 선택하세요.");
      if (extra.kcalPer100g === "" || extra.kcalPer100g < 0)
        throw new Error("100g당 칼로리를 입력하세요.");
      if (extra.nutrition.protein < 0) throw new Error("조단백을 입력하세요.");
      if (extra.nutrition.fat < 0) throw new Error("조지방을 입력하세요.");
      if (extra.nutrition.moisture < 0) throw new Error("수분을 입력하세요.");
    }
  };

  // --- 서버 전송용 quantity 계산 ---
  const getSubmitQuantity = (): number => {
    const inputQuantity = form.quantity === "" ? 0 : form.quantity;

    // 수정 시: 입력값 + buyQuantity (판매된 수량 다시 합산)
    // 등록 시: 입력값 그대로
    return formType === "modify" ? inputQuantity + buyQuantity : inputQuantity;
  };

  // --- 제출 ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      validate();
      setIsSubmitting(true);

      // 새 파일만 추출
      const newThumbnailFile = thumbnail?.type === "new" ? thumbnail.file : null;
      const newDetailFiles = detailImages
        .filter((img): img is NewImageFile => img.type === "new")
        .map((img) => img.file);

      // 기존 이미지 추출
      const existingMainImages = thumbnail?.type === "existing" ? [thumbnail.data] : undefined;
      const existingDetailImages = detailImages
        .filter((img): img is ExistingImage => img.type === "existing")
        .map((img) => img.data);

      // 서버 전송용 폼 데이터 (quantity 재계산)
      const submitForm = {
        ...form,
        quantity: getSubmitQuantity(),
      };

      if (formType === "create") {
        if (!newThumbnailFile) throw new Error("썸네일 이미지를 등록하세요.");

        const result = await createProduct(submitForm, newThumbnailFile, newDetailFiles);
        console.log("등록 완료:", result);
        alert("상품이 등록되었습니다.");
      } else {
        if (!initialData?._id) throw new Error("상품 ID가 없습니다.");

        const result = await updateProduct(
          initialData._id,
          submitForm,
          newThumbnailFile,
          newDetailFiles,
          existingMainImages,
          existingDetailImages,
        );
        console.log("수정 완료:", result);
        alert("상품이 수정되었습니다.");
      }
      router.push("/admin/products");
    } catch (e) {
      if (e instanceof Error) setError(e.message);
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
              <h1 className="text-3xl font-semibold text-gray-900">
                {formType === "create" ? "상품 등록" : "상품 수정"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">사료 추천 시스템용 상품 데이터 등록</p>
            </div>
          </div>

          {formType === "create" && (
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
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">코드명 *</label>
                    <input
                      type="text"
                      name="code"
                      required
                      value={form.extra.code}
                      onChange={handleExtraText}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="예: SNR-GF-01"
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
                        {formType === "modify" && buyQuantity > 0 && (
                          <span className="ml-2 text-xs text-blue-600 font-normal">
                            (판매: {buyQuantity}개)
                          </span>
                        )}
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
                      value={form.content}
                      onChange={handleContentChange}
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
                            src={getDetailImageSrc(image)}
                            alt={`Detail ${index}`}
                            className="w-full h-30 object-cover rounded-lg border border-gray-200"
                          />
                          {/* 기존 이미지 표시 */}
                          {image.type === "existing" && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-gray-800/70 text-white text-[10px] rounded">
                              기존
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeDetailImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="mt-1 text-[10px] text-gray-500 truncate px-1">
                            {getDetailImageName(image)}
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
                              onClick={() => updateExtra({ neutered: o.value as Neutered })}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">포함 원료</p>
                        <div className="flex flex-wrap gap-2">
                          {OPTIONS.ingredientsContains.map((v) => (
                            <CheckboxPill
                              key={v}
                              label={v}
                              checked={form.extra.ingredients.contains.includes(v)}
                              onClick={() => handleNestedToggle("ingredients", "contains", v)}
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
                              checked={form.extra.ingredients.avoid.includes(v)}
                              onClick={() => handleNestedToggle("ingredients", "avoid", v)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

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
                              checked={form.extra.avoidIf.allergies.includes(v)}
                              onClick={() => handleNestedToggle("avoidIf", "allergies", v)}
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
                              checked={form.extra.avoidIf.diseases.includes(v)}
                              onClick={() => handleNestedToggle("avoidIf", "diseases", v)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

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
                            name="protein"
                            value={form.extra.nutrition.protein}
                            onChange={handleNutritionChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div className="w-1/3">
                          <label className="text-xs text-gray-500 mb-1 block">조지방(%) *</label>
                          <input
                            type="number"
                            name="fat"
                            value={form.extra.nutrition.fat}
                            onChange={handleNutritionChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div className="w-1/3">
                          <label className="text-xs text-gray-500 mb-1 block">수분(%) *</label>
                          <input
                            type="number"
                            name="moisture"
                            value={form.extra.nutrition.moisture}
                            onChange={handleNutritionChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽: 썸네일 & 액션 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">썸네일 (mainImages) *</h2>
                <div className="space-y-4">
                  {thumbnail ? (
                    <div className="relative">
                      <img
                        src={getThumbnailSrc()}
                        alt="Thumbnail"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      {thumbnail.type === "existing" && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-gray-800/70 text-white text-xs rounded">
                          기존 이미지
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="mt-2 text-xs text-gray-600 truncate">
                        {thumbnail.type === "new" ? thumbnail.file.name : thumbnail.data.name}
                      </p>
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
                  {isSubmitting
                    ? formType === "create"
                      ? "등록 중..."
                      : "수정 중..."
                    : formType === "create"
                      ? `${productType} 등록`
                      : `${productType} 수정`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
