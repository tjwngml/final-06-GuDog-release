import type { Review } from "./review";

// ============================================================
// OPTIONS (단일 소스 - UI 렌더링 + 타입 파생)
// ============================================================
export const OPTIONS = {
  lineTag: [
    { value: "", label: "선택 안함" },
    { value: "puppy", label: "puppy" },
    { value: "adult", label: "adult" },
    { value: "functional", label: "functional" },
    { value: "senior", label: "senior" },
    { value: "LID", label: "LID" },
  ] as const,

  lifeStage: ["퍼피", "성견", "시니어"] as const,
  size: ["소형견", "중형견", "대형견"] as const,
  neutered: [
    { value: "both", label: "무관" },
    { value: "yes", label: "중성화 O" },
    { value: "no", label: "중성화 X" },
  ] as const,

  bodyType: ["마름", "적정", "과체중", "비만"] as const,
  activityLevel: ["적음", "보통", "많음"] as const,

  mainProtein: ["닭고기", "오리고기", "양고기", "소고기", "연어", "칠면조"] as const,
  healthBenefits: ["피부/모질", "소화/장 건강", "관절/뼈 건강", "체중 관리"] as const,

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
  ] as const,
  ingredientsAvoid: ["밀", "옥수수", "쌀", "곡물 전체"] as const,

  avoidAllergies: [
    "닭고기",
    "소고기",
    "양고기",
    "생선",
    "달걀",
    "유제품",
    "밀/곡물",
    "완두콩·콩류",
  ] as const,
  avoidDiseases: ["신장 질환", "심장 질환", "췌장·간 질환", "당뇨"] as const,

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
  ] as const,
} as const;

// ============================================================
// 유틸리티 타입
// ============================================================
type OptionValues<T extends readonly string[]> = T[number];
type SelectOption = readonly { readonly value: string; readonly label: string }[];
type SelectValues<T extends SelectOption> = T[number]["value"];

// ============================================================
// OPTIONS 파생 타입
// ============================================================
export type LineTag = SelectValues<typeof OPTIONS.lineTag>;
export type LifeStage = OptionValues<typeof OPTIONS.lifeStage>;
export type Size = OptionValues<typeof OPTIONS.size>;
export type Neutered = SelectValues<typeof OPTIONS.neutered>;
export type BodyType = OptionValues<typeof OPTIONS.bodyType>;
export type ActivityLevel = OptionValues<typeof OPTIONS.activityLevel>;
export type MainProtein = OptionValues<typeof OPTIONS.mainProtein>;
export type HealthBenefit = OptionValues<typeof OPTIONS.healthBenefits>;
export type IngredientContains = OptionValues<typeof OPTIONS.ingredientsContains>;
export type IngredientAvoid = OptionValues<typeof OPTIONS.ingredientsAvoid>;
export type AvoidAllergy = OptionValues<typeof OPTIONS.avoidAllergies>;
export type AvoidDisease = OptionValues<typeof OPTIONS.avoidDiseases>;
export type SpecialFeature = OptionValues<typeof OPTIONS.specialFeatures>;

// ============================================================
// 도메인 인터페이스
// ============================================================
export interface ProductImage {
  path: string;
  name: string;
}

export interface ProductIngredients {
  contains: IngredientContains[];
  avoid: IngredientAvoid[];
}

export interface ProductAvoidIf {
  allergies: AvoidAllergy[];
  diseases: AvoidDisease[];
}

export interface ProductNutrition {
  protein: number;
  fat: number;
  moisture: number;
}

interface ProductExtraBase {
  state?: string[];
  period?: string;
  code: string;
  weight: number;
  bodyType: BodyType[];
  activityLevel: ActivityLevel[];
  neutered: Neutered;
  grainFree: boolean;
  category?: string[];
  feedstuff?: boolean;
  foodType: "건식" | "습식";
  healthBenefits: HealthBenefit[];
  ingredients: ProductIngredients;
  avoidIf: ProductAvoidIf;
  specialFeatures: SpecialFeature[];
  detailImages: ProductImage[];
  lineTag: LineTag;
  content: string;
}

interface FoodExtra extends ProductExtraBase {
  type: "사료";
  lifeStage: LifeStage[];
  size: Size[];
  mainProtein: MainProtein[];
  kcalPer100g: number;
  nutrition: ProductNutrition;
}

interface SnackExtra extends ProductExtraBase {
  type: "간식";
  lifeStage?: LifeStage[];
  size?: Size[];
  mainProtein?: MainProtein[];
  kcalPer100g?: number;
  nutrition?: ProductNutrition;
}

export type ProductExtra = FoodExtra | SnackExtra;

export interface Product {
  _id: number;
  seller_id: number;
  price: number;
  quantity: number;
  buyQuantity: number;
  shippingFees: number;
  show: boolean;
  active: boolean;
  name: string;
  mainImages: ProductImage[];
  content: string;
  extra: ProductExtra;
  createdAt: string;
  updatedAt: string;
  replies?: Review[];
}
