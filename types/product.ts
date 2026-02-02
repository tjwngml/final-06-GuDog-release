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

export interface ProductExtra {
  type?: "사료" | "간식";
  state?: string[];
  orderdate?: string;
  period?: string;
  code?: string;
  discount?: string | number;
  weight?: number;
  size?: Size[];
  lifeStage?: LifeStage[];
  bodyType?: BodyType[];
  activityLevel?: ActivityLevel[];
  neutered?: Neutered;
  mainProtein?: MainProtein[];
  grainFree?: boolean;
  category?: string[];
  feedstuff?: boolean;
  foodType?: string;
  healthBenefits?: HealthBenefit[];
  kcalPer100g?: number;
  ingredients?: ProductIngredients;
  avoidIf?: ProductAvoidIf;
  specialFeatures?: SpecialFeature[];
  nutrition?: ProductNutrition;
  detailImages?: ProductImage[];
  lineTag?: LineTag;
}

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
  content: string;
  mainImages: ProductImage[];
  extra?: ProductExtra;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 폼 상태 (등록/수정 공용)
// ============================================================
export interface ProductFormExtra {
  content: string;

  type: "사료" | "간식";
  weight: number | "";
  lineTag: LineTag;
  detailImages: ProductImage[];

  // 대상
  lifeStage: LifeStage[];
  size: Size[];
  neutered: Neutered;
  bodyType: BodyType[];
  activityLevel: ActivityLevel[];

  // 원료/타입
  mainProtein: MainProtein[];
  grainFree: boolean;
  foodType: "건식" | "습식";

  // 건강/기능
  healthBenefits: HealthBenefit[];
  kcalPer100g: number | "";

  // 상세 원료
  ingredientsContains: IngredientContains[];
  ingredientsAvoid: IngredientAvoid[];

  // 제외 조건
  avoidAllergies: AvoidAllergy[];
  avoidDiseases: AvoidDisease[];

  // 태그
  specialFeatures: SpecialFeature[];

  // 영양 (선택)
  nutriProtein: number | "";
  nutriFat: number | "";
  nutriMoisture: number | "";
}

export interface ProductFormState {
  name: string;
  price: number | "";
  quantity: number | "";
  mainImages: ProductImage[];
  extra: ProductFormExtra;
}

export const INITIAL_PRODUCT_FORM: ProductFormState = {
  name: "",
  price: "",
  quantity: "",
  mainImages: [],
  extra: {
    content: "",

    type: "사료",
    weight: "",
    lineTag: "",
    detailImages: [],

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
  },
};
