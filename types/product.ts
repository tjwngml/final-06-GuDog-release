// 상품 이미지 정보
export interface ProductImage {
  path: string;
  name: string;
}

// 상품 추가 정보 내의 세부 객체들
export interface ProductIngredients {
  contains: string[];
  avoid: string[];
}

export interface ProductAvoidIf {
  allergies: string[];
  diseases: string[];
}

export interface ProductNutrition {
  protein: number;
  fat: number;
  moisture: number;
}

// 상품 추가 정보 (상세 속성)
export interface ProductExtra {
  state?: string[];
  orderdate?: string;
  period?: string;
  code?: string;
  discount?: string | number;
  weight?: number;
  size?: string[];
  lifeStage?: string[];
  bodyType?: string[];
  activityLevel?: string[];
  neutered?: "both" | "yes" | "no";
  mainProtein?: string[];
  grainFree?: boolean;
  category?: string[];
  feedstuff?: boolean;
  foodType?: string;
  healthBenefits?: string[];
  kcalPer100g?: number;
  ingredients?: ProductIngredients;
  avoidIf?: ProductAvoidIf;
  specialFeatures?: string[];
  nutrition?: ProductNutrition;
}

// 개별 상품 인터페이스
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
