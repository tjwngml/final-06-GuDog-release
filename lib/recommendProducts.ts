import { getProducts, getProductsByCodes as fetchProductsByCodes } from "@/lib/product";

// 기본 설문 타입
export interface SurveyFormData {
  size: string;
  age: string;
  bodyType: string;
  allergies: string[];
  healthConcerns: string[];
  protein: string;
  grainPreference: string;
}

// 확장된 설문 타입
export interface ExtendedSurveyFormData extends SurveyFormData {
  neutered: string;
  activityLevel: string;
  currentFeedIssues: string[];
  diagnosedDiseases: string[];
  foodType: string;
}

// 상품 데이터 타입
export interface ProductData {
  price: number;
  quantity: number;
  name: string;
  content: string;
  shippingFees?: number;
  mainImages?: { path: string; name: string }[];
  show?: boolean;
  extra: {
    code: string;
    weight: number;
    size: string[];
    lifeStage: string[];
    bodyType: string[];
    activityLevel: string[];
    neutered: "both" | "yes" | "no";
    mainProtein: string[];
    grainFree: boolean;
    foodType: "건식" | "습식";
    healthBenefits: string[];
    kcalPer100g: number;
    ingredients: {
      contains: string[];
      avoid: string[];
    };
    avoidIf: {
      allergies: string[];
      diseases: string[];
    };
    specialFeatures: string[];
    nutrition: {
      protein: number;
      fat: number;
      moisture: number;
    };
    detailImages?: { path: string; name: string }[];
  };
}

// 추천 결과 타입
export interface RecommendationResult {
  code: string;
  score: number;
}

/**
 * 설문 데이터 매핑 함수들
 */
function mapSurveySize(surveySize: string): string {
  if (surveySize.includes("소형")) return "소형견";
  if (surveySize.includes("중형")) return "중형견";
  if (surveySize.includes("대형")) return "대형견";
  return "";
}

function mapSurveyAge(surveyAge: string): string {
  const ageMap: Record<string, string> = {
    puppy: "퍼피",
    adult: "성견",
    senior: "시니어",
  };
  return ageMap[surveyAge] || "";
}

function mapSurveyBodyType(surveyBodyType: string): string {
  const bodyMap: Record<string, string> = {
    thin: "마름",
    ideal: "적정",
    overweight: "과체중",
    obese: "비만",
  };
  return bodyMap[surveyBodyType] || "";
}

function mapSurveyAllergies(surveyAllergies: string[]): string[] {
  if (surveyAllergies.includes("없음")) return [];
  const allergenMap: Record<string, string> = {
    닭고기: "닭고기",
    곡물: "밀/곡물",
    "밀/곡물": "밀/곡물",
    생선: "생선",
    양고기: "양고기",
    소고기: "소고기",
    오리: "오리고기",
    달걀: "달걀",
    유제품: "유제품",
    "완두콩·콩류": "완두콩",
  };
  return surveyAllergies.map((a) => allergenMap[a] || a).filter(Boolean);
}

export function mapSurveyHealthConcerns(surveyConcerns: string[]): string[] {
  if (surveyConcerns.includes("없음")) return [];
  return surveyConcerns
    .map((c) => {
      if (c.includes("피부")) return "피부/모질";
      if (c.includes("소화")) return "소화/장 건강";
      if (c.includes("관절")) return "관절/뼈 건강";
      if (c.includes("체중")) return "체중 관리";
      return "";
    })
    .filter(Boolean);
}

function mapSurveyProtein(surveyProtein: string): string | null {
  const proteinMap: Record<string, string> = {
    닭고기: "닭고기",
    오리: "오리고기",
    오리고기: "오리고기",
    양고기: "양고기",
    연어: "연어",
    소고기: "소고기",
    칠면조: "칠면조",
  };
  return surveyProtein === "상관없음" ? null : proteinMap[surveyProtein] || null;
}

function mapSurveyDiseases(surveyDiseases: string[]): string[] {
  if (!surveyDiseases || surveyDiseases.includes("없음")) return [];
  return surveyDiseases.filter((d) => d !== "기타 질환 있음 (상세 불필요)");
}

function mapSurveyFoodType(surveyFoodType: string): string | null {
  if (!surveyFoodType) return null;
  if (surveyFoodType.includes("건식")) return "건식";
  if (surveyFoodType.includes("습식")) return "습식";
  return null;
}

/**
 * 1단계: 필수 필터링 (Safety First)
 */
function filterBySafety(
  products: ProductData[],
  mappedAllergies: string[],
  mappedDiseases: string[],
  grainPreference: string,
): ProductData[] {
  return products.filter((product) => {
    if (mappedAllergies.some((allergy) => product.extra.avoidIf.allergies.includes(allergy))) {
      return false;
    }
    if (mappedDiseases.some((disease) => product.extra.avoidIf.diseases.includes(disease))) {
      return false;
    }
    if (grainPreference === "그레인프리(Grain Free) 선호" && product.extra.grainFree === false) {
      return false;
    }
    return true;
  });
}

/**
 * 2단계: 적합성 필터링 (Basic Matching)
 */
function filterBySuitability(
  products: ProductData[],
  mappedSize: string,
  mappedAge: string,
  mappedFoodType: string | null,
): ProductData[] {
  return products.filter((product) => {
    if (mappedSize && !product.extra.size.includes(mappedSize)) return false;
    if (mappedAge && !product.extra.lifeStage.includes(mappedAge)) return false;
    if (mappedFoodType && product.extra.foodType !== mappedFoodType) return false;
    return true;
  });
}

/**
 * 3단계: 점수 계산 (Scoring)
 */
function calculateScore(product: ProductData, formData: ExtendedSurveyFormData): number {
  let score = 0;

  const mappedHealthConcerns = mapSurveyHealthConcerns(formData.healthConcerns);
  const mappedBodyType = mapSurveyBodyType(formData.bodyType);
  const mappedProtein = mapSurveyProtein(formData.protein);
  const mappedAllergies = mapSurveyAllergies(formData.allergies);

  // 1. 건강 고민 매칭 (+10점/개)
  mappedHealthConcerns.forEach((concern) => {
    if (product.extra.healthBenefits.includes(concern)) {
      score += 10;
    }
  });

  // 2. 체중 관리 로직
  const isOverweight = ["과체중", "비만"].includes(formData.bodyType);
  const isThin = formData.bodyType === "마름";

  if (isOverweight) {
    if (product.extra.healthBenefits.includes("체중 관리")) score += 8;
    if (product.extra.kcalPer100g <= 320) score += 5;
    if (product.extra.kcalPer100g > 380) score -= 5;
  }
  if (isThin) {
    if (product.extra.kcalPer100g >= 380) score += 5;
    if (product.extra.healthBenefits.includes("체중 관리")) score -= 3;
  }

  // 3. 중성화 여부
  if (formData.neutered === "예") {
    if (product.extra.healthBenefits.includes("체중 관리") || product.extra.kcalPer100g <= 330) {
      score += 6;
    }
  } else if (formData.neutered === "아니요") {
    if (product.extra.kcalPer100g >= 370) score += 4;
  }

  // 4. 활동량
  if (formData.activityLevel === "많음" && product.extra.kcalPer100g >= 380) score += 3;
  if (formData.activityLevel === "적음" && product.extra.kcalPer100g <= 340) score += 3;

  // 5. 단백질 선호 (+7점)
  if (mappedProtein && product.extra.mainProtein.includes(mappedProtein)) {
    score += 7;
  }

  // 6. 체형 매칭 (+4점)
  if (product.extra.bodyType.includes(mappedBodyType)) {
    score += 4;
  }

  // 7. 복합 알러지 + 싱글프로틴 (+8점)
  if (mappedAllergies.length >= 2 && product.extra.specialFeatures.includes("싱글프로틴")) {
    score += 8;
  }

  // 8. 기타 알러지 + 저자극성 (+5점)
  if (
    formData.allergies.includes("기타 알러지 있음 (구체적 원료 미상)") &&
    product.extra.specialFeatures.includes("저자극성")
  ) {
    score += 5;
  }

  return score;
}

/**
 * 🚀 메인 추천 함수 (설문 페이지에서 호출)
 * - 전체 상품을 불러와서 필터링 및 점수 계산 후 상위 5개 반환
 */
export async function recommendProducts(
  formData: ExtendedSurveyFormData,
): Promise<RecommendationResult[] | null> {
  // 전체 상품 데이터 조회
  const allProductsRes = await getProducts({ sort: { rating: -1 } });

  if (!allProductsRes.ok || !allProductsRes.item) {
    console.error("상품 데이터 조회 실패");
    return null;
  }

  const dogFoodData = allProductsRes.item as ProductData[];

  const mappedSize = mapSurveySize(formData.size);
  const mappedAge = mapSurveyAge(formData.age);
  const mappedAllergies = mapSurveyAllergies(formData.allergies);
  const mappedDiseases = mapSurveyDiseases(formData.diagnosedDiseases);
  const mappedFoodType = mapSurveyFoodType(formData.foodType);

  let products = [...dogFoodData];

  products = filterBySafety(products, mappedAllergies, mappedDiseases, formData.grainPreference);
  products = filterBySuitability(products, mappedSize, mappedAge, mappedFoodType);

  if (products.length === 0) return null;

  const scoredProducts = products.map((product) => ({
    code: product.extra.code,
    score: calculateScore(product, formData),
  }));

  scoredProducts.sort((a, b) => b.score - a.score);

  return scoredProducts.slice(0, 5);
}

/**
 * 코드로 제품 데이터 조회 (결과 페이지에서 호출)
 * - 특정 code 배열로 해당 상품들만 조회
 */
export async function getProductsByCodeList(codes: string[]): Promise<ProductData[]> {
  const productsRes = await fetchProductsByCodes(codes);

  if (!productsRes.ok || !productsRes.item) {
    console.error("상품 데이터 조회 실패");
    return [];
  }

  const products = productsRes.item as ProductData[];

  // code 순서대로 정렬 (추천 순위 유지)
  const codeOrder = new Map(codes.map((code, index) => [code, index]));
  products.sort((a, b) => {
    const orderA = codeOrder.get(a.extra.code) ?? Infinity;
    const orderB = codeOrder.get(b.extra.code) ?? Infinity;
    return orderA - orderB;
  });

  return products;
}

/**
 * URL 생성 함수
 */
export function createResultUrl(
  results: RecommendationResult[] | null,
  formData?: ExtendedSurveyFormData,
): string {
  if (!results || results.length === 0) return `/survey/result`;

  const params = new URLSearchParams();
  params.set("top", results.map((r) => r.code).join(","));

  if (formData) {
    params.set("size", formData.size.replace(/\s*\(.*\)/, ""));
    params.set("age", formData.age);
    params.set("protein", formData.protein);

    const healthConcerns = formData.healthConcerns.filter((c) => c !== "없음");
    const simpleHealth = mapSurveyHealthConcerns(healthConcerns);
    if (simpleHealth.length > 0) {
      params.set("health", simpleHealth.join(","));
    }
  }

  return `/survey/result?${params.toString()}`;
}

export function parseResultCodes(codeParam: string | null): string[] | null {
  if (!codeParam) return null;
  return decodeURIComponent(codeParam).split(",");
}
