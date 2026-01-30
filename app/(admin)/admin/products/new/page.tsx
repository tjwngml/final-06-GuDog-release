"use client";

import { useRef, useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Upload, X, Save, Eye } from "lucide-react";

// ===== 타입 정의 =====
type Neutered = "both" | "yes" | "no";
type FoodType = "건식" | "습식";
type LineTag = "" | "puppy" | "adult" | "functional" | "senior" | "LID";

interface ImageFile {
  file: File;
  preview: string;
}

interface FormState {
  // 기본 정보
  name: string;
  price: number | "";
  quantity: number | ""; // 재고
  weight: number | ""; // 용량(g)
  content: string;
  imagePath: string; // 이미지 경로 prefix

  // 분류
  lineTag: LineTag;

  // extra - 대상
  lifeStage: string[];
  size: string[];
  neutered: Neutered;
  bodyType: string[];
  activityLevel: string[];

  // extra - 원료/타입
  mainProtein: string[];
  grainFree: boolean;
  foodType: FoodType;

  // extra - 건강/기능
  healthBenefits: string[];
  kcalPer100g: number | "";

  // extra - 상세 원료
  ingredientsContains: string[];
  ingredientsAvoid: string[];

  // extra - 제외 조건
  avoidAllergies: string[];
  avoidDiseases: string[];

  // extra - 태그
  specialFeatures: string[];

  // extra - 영양 (선택)
  nutriProtein: number | "";
  nutriFat: number | "";
  nutriMoisture: number | "";
}

// ===== 옵션 상수 (설문 로직과 일치) =====
const OPTIONS = {
  lineTag: [
    { value: "", label: "선택 안함" },
    { value: "puppy", label: "puppy" },
    { value: "adult", label: "adult" },
    { value: "functional", label: "functional" },
    { value: "senior", label: "senior" },
    { value: "LID", label: "LID" },
  ] as const,

  lifeStage: ["퍼피", "성견", "시니어"],
  size: ["소형견", "중형견", "대형견"],
  neutered: [
    { value: "both", label: "무관" },
    { value: "yes", label: "중성화 O" },
    { value: "no", label: "중성화 X" },
  ] as const,

  bodyType: ["마름", "적정", "과체중", "비만"],
  activityLevel: ["적음", "보통", "많음"],

  mainProtein: ["닭고기", "오리고기", "양고기", "소고기", "연어", "칠면조"],
  healthBenefits: ["피부/모질", "소화/장 건강", "관절/뼈 건강", "체중 관리"],

  ingredientsContains: [
    "닭고기",
    "오리고기",
    "양고기",
    "소고기",
    "연어",
    "칠면조",
    "쌀",
    "현미",
    "귀리",
    "보리",
    "감자",
    "고구마",
    "완두콩·콩류",
    "타피오카",
    "비트펄프",
    "아마씨",
    "연어오일",
    "크랜베리",
  ],
  ingredientsAvoid: ["밀", "옥수수", "쌀", "곡물 전체"],

  avoidAllergies: [
    "닭고기",
    "소고기",
    "양고기",
    "생선",
    "달걀",
    "유제품",
    "밀/곡물",
    "완두콩·콩류",
  ],
  avoidDiseases: ["신장 질환", "심장 질환", "췌장·간 질환", "당뇨"],

  specialFeatures: [
    "퍼피 전용",
    "시니어 전용",
    "소형견 키블",
    "대형견 키블",
    "그레인프리",
    "저칼로리",
    "저자극성",
    "오메가3 풍부",
    "DHA 함유",
    "관절 영양 강화",
    "항산화 성분",
    "프로바이오틱스",
    "프리바이오틱스",
  ],
} as const;

// ===== 유틸리티 =====
function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function toggleArray(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

// ===== 메인 컴포넌트 =====
export default function ProductCreatePage() {
  // 폼 상태
  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    quantity: "",
    weight: "",
    content: "",
    imagePath: "/images/products",

    lineTag: "",

    lifeStage: [],
    size: [],
    neutered: "both",

    bodyType: [],
    activityLevel: [],

    mainProtein: [],
    grainFree: false,
    foodType: "건식",

    healthBenefits: [],
    kcalPer100g: "",

    ingredientsContains: [],
    ingredientsAvoid: [],

    avoidAllergies: [],
    avoidDiseases: [],
    specialFeatures: [],

    nutriProtein: "",
    nutriFat: "",
    nutriMoisture: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [jsonPreview, setJsonPreview] = useState<string>("{}");

  // 이미지 상태
  const [thumbnail, setThumbnail] = useState<ImageFile | null>(null);
  const [detailImages, setDetailImages] = useState<ImageFile[]>([]); // 상세 이미지

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const detailImagesInputRef = useRef<HTMLInputElement>(null);

  // 입력 핸들러
  const handleText = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
  };

  const handleToggle = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: toggleArray(prev[key] as string[], value) }));
  };

  // 썸네일 핸들러
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

  // 상세 이미지 핸들러
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

  // JSON 생성 로직
  const buildJsonObject = () => {
    setError(null);

    // 필수값 검증
    if (!form.name.trim()) throw new Error("상품명을 입력하세요.");
    if (form.price === "" || form.price < 0) throw new Error("가격을 올바르게 입력하세요.");
    if (form.quantity === "" || form.quantity < 0)
      throw new Error("재고 수량을 올바르게 입력하세요.");
    if (form.weight === "" || form.weight <= 0) throw new Error("용량을 올바르게 입력하세요.");
    if (!form.content.trim()) throw new Error("상품 설명을 입력하세요.");

    if (form.lifeStage.length === 0) throw new Error("라이프스테이지를 최소 1개 선택하세요.");
    if (form.size.length === 0) throw new Error("견종 크기를 최소 1개 선택하세요.");
    if (form.mainProtein.length === 0) throw new Error("주 단백질을 최소 1개 선택하세요.");

    // 1. 썸네일 -> mainImages
    const mainImages = thumbnail ? [{ path: form.imagePath, name: thumbnail.file.name }] : [];

    // 2. 상세 이미지 -> extra.detailImages
    const detailImagesJson = detailImages.map((img) => ({
      path: form.imagePath,
      name: img.file.name,
    }));

    const product: any = {
      price: Number(form.price),
      quantity: Number(form.quantity),
      weight: Number(form.weight),
      name: form.name.trim(),
      mainImages, // 썸네일만 여기
      content: form.content.trim(),
      extra: {
        detailImages: detailImagesJson, // 상세 이미지는 여기!

        size: form.size,
        lifeStage: form.lifeStage,
        bodyType: form.bodyType,
        activityLevel: form.activityLevel,
        neutered: form.neutered,

        mainProtein: form.mainProtein,
        grainFree: form.grainFree,
        foodType: form.foodType,

        healthBenefits: form.healthBenefits,
        kcalPer100g: Number(form.kcalPer100g),

        ingredients: {
          contains: form.ingredientsContains,
          avoid: form.ingredientsAvoid,
        },
        avoidIf: {
          allergies: form.avoidAllergies,
          diseases: form.avoidDiseases,
        },
        specialFeatures: form.specialFeatures,
      },
    };

    // 선택적 영양성분
    const nutrition: Record<string, number> = {};
    if (form.nutriProtein !== "") nutrition.protein = Number(form.nutriProtein);
    if (form.nutriFat !== "") nutrition.fat = Number(form.nutriFat);
    if (form.nutriMoisture !== "") nutrition.moisture = Number(form.nutriMoisture);
    if (Object.keys(nutrition).length) product.extra.nutrition = nutrition;

    if (form.lineTag) product.extra.lineTag = form.lineTag;

    return product;
  };

  const handleMakePreview = () => {
    try {
      const json = buildJsonObject();
      setJsonPreview(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const json = buildJsonObject();
      setJsonPreview(JSON.stringify(json, null, 2));
      console.log("Submit JSON:", json);
      alert("JSON 생성 완료! (콘솔 확인)");
    } catch (e: any) {
      setError(e.message);
    }
  };

  // UI 컴포넌트: 선택 Pill
  const CheckboxPill = ({
    checked,
    label,
    onClick,
  }: {
    checked: boolean;
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors",
        checked
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      )}
    >
      {label}
    </button>
  );

  const RadioPill = ({
    selected,
    label,
    onClick,
  }: {
    selected: boolean;
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors",
        selected
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button type="button" className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">상품 등록</h1>
            <p className="mt-1 text-sm text-gray-600">사료 추천 시스템용 상품 데이터 등록</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ========== 왼쪽: 데이터 입력 영역 ========== */}
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
                    onChange={handleText}
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
                        onChange={handleNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-3 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        원
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      재고 수량(quantity) *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min={0}
                      value={form.quantity}
                      onChange={handleNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="예: 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      용량(weight, g) *
                    </label>
                    <input
                      type="number"
                      name="weight"
                      required
                      min={1}
                      value={form.weight}
                      onChange={handleNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="예: 600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상품 설명(content) *
                  </label>
                  <textarea
                    name="content"
                    required
                    value={form.content}
                    onChange={handleText}
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
                    value={form.lineTag}
                    onChange={handleText}
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

            {/* 2. 상세 이미지 (extra.detailImages) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                상세 이미지 (extra.detailImages)
              </h2>
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
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeDetailImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

            {/* 3. extra 정보 (타겟/원료/기능) */}
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
                          checked={form.lifeStage.includes(v)}
                          onClick={() => handleToggle("lifeStage", v)}
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
                          checked={form.size.includes(v)}
                          onClick={() => handleToggle("size", v)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">중성화 *</p>
                    <div className="flex flex-wrap gap-2">
                      {OPTIONS.neutered.map((o) => (
                        <RadioPill
                          key={o.value}
                          label={o.label}
                          selected={form.neutered === o.value}
                          onClick={() => setForm((p) => ({ ...p, neutered: o.value }))}
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
                          checked={form.bodyType.includes(v)}
                          onClick={() => handleToggle("bodyType", v)}
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
                          checked={form.activityLevel.includes(v)}
                          onClick={() => handleToggle("activityLevel", v)}
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
                          checked={form.mainProtein.includes(v)}
                          onClick={() => handleToggle("mainProtein", v)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">그레인프리 *</p>
                    <div className="flex flex-wrap gap-2">
                      <RadioPill
                        label="그레인프리"
                        selected={form.grainFree === true}
                        onClick={() => setForm((p) => ({ ...p, grainFree: true }))}
                      />
                      <RadioPill
                        label="곡물 포함"
                        selected={form.grainFree === false}
                        onClick={() => setForm((p) => ({ ...p, grainFree: false }))}
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
                          checked={form.healthBenefits.includes(v)}
                          onClick={() => handleToggle("healthBenefits", v)}
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
                      required
                      min={1}
                      value={form.kcalPer100g}
                      onChange={handleNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* 포함/제외 원료 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">포함 원료 (contains)</p>
                    <div className="flex flex-wrap gap-2">
                      {OPTIONS.ingredientsContains.map((v) => (
                        <CheckboxPill
                          key={v}
                          label={v}
                          checked={form.ingredientsContains.includes(v)}
                          onClick={() => handleToggle("ingredientsContains", v)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">제외 원료 (avoid)</p>
                    <div className="flex flex-wrap gap-2">
                      {OPTIONS.ingredientsAvoid.map((v) => (
                        <CheckboxPill
                          key={v}
                          label={v}
                          checked={form.ingredientsAvoid.includes(v)}
                          onClick={() => handleToggle("ingredientsAvoid", v)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 제외 조건 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 text-red-600">
                      알러지 제외 (avoidIf)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {OPTIONS.avoidAllergies.map((v) => (
                        <CheckboxPill
                          key={v}
                          label={v}
                          checked={form.avoidAllergies.includes(v)}
                          onClick={() => handleToggle("avoidAllergies", v)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 text-red-600">
                      질환 제외 (avoidIf)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {OPTIONS.avoidDiseases.map((v) => (
                        <CheckboxPill
                          key={v}
                          label={v}
                          checked={form.avoidDiseases.includes(v)}
                          onClick={() => handleToggle("avoidDiseases", v)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 특징 / 영양성분 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">특징 태그</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {OPTIONS.specialFeatures.map((v) => (
                      <CheckboxPill
                        key={v}
                        label={v}
                        checked={form.specialFeatures.includes(v)}
                        onClick={() => handleToggle("specialFeatures", v)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/3">
                      <label className="text-xs text-gray-500 mb-1 block">조단백(%)</label>
                      <input
                        type="number"
                        name="nutriProtein"
                        value={form.nutriProtein}
                        onChange={handleNumber}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="text-xs text-gray-500 mb-1 block">조지방(%)</label>
                      <input
                        type="number"
                        name="nutriFat"
                        value={form.nutriFat}
                        onChange={handleNumber}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="text-xs text-gray-500 mb-1 block">수분(%)</label>
                      <input
                        type="number"
                        name="nutriMoisture"
                        value={form.nutriMoisture}
                        onChange={handleNumber}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* JSON 미리보기 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">JSON 미리보기</h2>
                <button
                  type="button"
                  onClick={handleMakePreview}
                  className="text-sm border px-3 py-1 rounded hover:bg-gray-50"
                >
                  생성
                </button>
              </div>
              <pre className="text-xs bg-gray-900 text-gray-100 rounded p-4 overflow-auto max-h-[300px]">
                {jsonPreview}
              </pre>
            </div>
          </div>

          {/* ========== 오른쪽: 썸네일 & 액션 ========== */}
          <div className="lg:col-span-1 space-y-6">
            {/* 썸네일 (mainImages) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">썸네일 (mainImages)</h2>
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
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
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

                {/* 이미지 경로 공통 설정 */}
                <div className="pt-4 border-t">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    이미지 경로 Prefix
                  </label>
                  <input
                    type="text"
                    name="imagePath"
                    value={form.imagePath}
                    onChange={handleText}
                    className="w-full text-sm px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
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
                  상품 등록
                </button>
                <button
                  type="button"
                  onClick={handleMakePreview}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  JSON 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
