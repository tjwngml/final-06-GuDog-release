import { uploadFiles } from "@/actions/uploadfiles";
import useUserStore from "@/zustand/useStore";
import {
  Product,
  ProductExtra,
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
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface ProductResponse {
  ok: 1;
  item: Product;
}

interface ProductErrorResponse {
  ok: 0;
  message: string;
  errors?: Record<string, { msg: string }>;
}

// ProductForm에서 사용하는 폼 상태 타입
export interface ProductFormState {
  name: string;
  price: number | "";
  quantity: number | "";
  shippingFees: number;
  extra: ProductFormExtra;
}

export interface ProductFormExtra {
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

/**
 * form → API payload 변환
 */
function buildPayloadExtra(
  extra: ProductFormExtra,
  detailImages: { path: string; name: string }[],
): ProductExtra {
  const base = {
    code: extra.code,
    weight: Number(extra.weight),
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
    detailImages,
  };

  if (extra.type === "사료") {
    return {
      ...base,
      type: "사료",
      lifeStage: extra.lifeStage,
      size: extra.size,
      mainProtein: extra.mainProtein,
      kcalPer100g: extra.kcalPer100g !== "" ? Number(extra.kcalPer100g) : 0,
      nutrition: extra.nutrition,
    };
  }

  return { ...base, type: "간식" };
}

/**
 * 상품 등록
 */
export async function createProduct(
  form: ProductFormState,
  thumbnailFile: File,
  detailImageFiles: File[],
): Promise<Product> {
  const token = useUserStore.getState().user?.token?.accessToken;
  if (!token) throw new Error("로그인이 필요합니다.");

  const [mainImages, detailImages] = await Promise.all([
    uploadFiles([thumbnailFile]),
    uploadFiles(detailImageFiles),
  ]);

  const payload = {
    price: Number(form.price),
    quantity: Number(form.quantity),
    shippingFees: form.shippingFees,
    name: form.name.trim(),
    content: form.extra.content.trim(),
    mainImages,
    extra: buildPayloadExtra(form.extra, detailImages),
  };

  const res = await fetch(`${API_URL}/seller/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: ProductResponse | ProductErrorResponse = await res.json();

  if (!res.ok || data.ok !== 1) {
    const errData = data as ProductErrorResponse;
    const errorMsg = errData.errors
      ? Object.values(errData.errors)[0].msg
      : errData.message || "상품 등록에 실패했습니다.";
    throw new Error(errorMsg);
  }

  return (data as ProductResponse).item;
}

/**
 * 상품 수정
 */
export async function updateProduct(
  productId: number,
  form: ProductFormState,
  thumbnailFile: File | null,
  detailImageFiles: File[],
  existingMainImages?: { path: string; name: string }[],
  existingDetailImages?: { path: string; name: string }[],
): Promise<Product> {
  const token = useUserStore.getState().user?.token?.accessToken;
  if (!token) throw new Error("로그인이 필요합니다.");

  const mainImages = thumbnailFile ? await uploadFiles([thumbnailFile]) : existingMainImages || [];

  const newDetailImages = detailImageFiles.length > 0 ? await uploadFiles(detailImageFiles) : [];

  const detailImages = [...(existingDetailImages || []), ...newDetailImages];

  const payload = {
    price: Number(form.price),
    quantity: Number(form.quantity),
    shippingFees: form.shippingFees,
    name: form.name.trim(),
    mainImages,
    extra: buildPayloadExtra(form.extra, detailImages),
  };

  const res = await fetch(`${API_URL}/seller/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: ProductResponse | ProductErrorResponse = await res.json();

  if (!res.ok || data.ok !== 1) {
    const errData = data as ProductErrorResponse;
    const errorMsg = errData.errors
      ? Object.values(errData.errors)[0].msg
      : errData.message || "상품 수정에 실패했습니다.";
    throw new Error(errorMsg);
  }

  return (data as ProductResponse).item;
}
