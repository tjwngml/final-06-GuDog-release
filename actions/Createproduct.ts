import { uploadFiles } from "@/actions/Uploadfiles";
import useUserStore from "@/app/(main)/(auth)/login/zustand/useStore";
import { Product, ProductExtra, ProductFormState } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface CreateProductResponse {
  ok: 1;
  item: Product;
}

interface CreateProductErrorResponse {
  ok: 0;
  message: string;
  errors?: Record<string, { msg: string }>;
}

/**
 * 상품 등록 전체 흐름
 * 1. 썸네일 업로드 → mainImages
 * 2. 상세이미지 업로드 → extra.detailImages
 * 3. POST /seller/products/ 호출
 */
export async function createProduct(
  form: ProductFormState,
  thumbnailFile: File,
  detailImageFiles: File[],
): Promise<Product> {
  const token = useUserStore.getState().user?.token?.accessToken;

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  // 1. 썸네일 업로드
  const mainImages = await uploadFiles([thumbnailFile]);

  // 2. 상세이미지 업로드
  const detailImages = await uploadFiles(detailImageFiles);

  // 3. extra 구성
  const { extra } = form;

  const payloadExtra: ProductExtra = {
    type: extra.type,
    weight: Number(extra.weight),
    detailImages,
  };

  if (extra.lineTag) payloadExtra.lineTag = extra.lineTag;

  // 사료 전용 extra
  if (extra.type === "사료") {
    payloadExtra.size = extra.size;
    payloadExtra.lifeStage = extra.lifeStage;
    payloadExtra.bodyType = extra.bodyType;
    payloadExtra.activityLevel = extra.activityLevel;
    payloadExtra.neutered = extra.neutered;
    payloadExtra.mainProtein = extra.mainProtein;
    payloadExtra.grainFree = extra.grainFree;
    payloadExtra.foodType = extra.foodType;
    payloadExtra.healthBenefits = extra.healthBenefits;

    if (extra.kcalPer100g !== "") payloadExtra.kcalPer100g = Number(extra.kcalPer100g);

    payloadExtra.ingredients = {
      contains: extra.ingredientsContains,
      avoid: extra.ingredientsAvoid,
    };

    payloadExtra.avoidIf = {
      allergies: extra.avoidAllergies,
      diseases: extra.avoidDiseases,
    };

    payloadExtra.specialFeatures = extra.specialFeatures;

    if (extra.nutriProtein !== "" && extra.nutriFat !== "" && extra.nutriMoisture !== "") {
      payloadExtra.nutrition = {
        protein: Number(extra.nutriProtein),
        fat: Number(extra.nutriFat),
        moisture: Number(extra.nutriMoisture),
      };
    }
  }

  // 4. 상품 등록 API 호출
  const payload = {
    price: Number(form.price),
    quantity: Number(form.quantity),
    name: form.name.trim(),
    content: form.extra.content.trim(),
    mainImages,
    extra: payloadExtra,
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

  const data: CreateProductResponse | CreateProductErrorResponse = await res.json();

  if (!res.ok || data.ok !== 1) {
    const errData = data as CreateProductErrorResponse;
    if (errData.errors) {
      const firstError = Object.values(errData.errors)[0];
      throw new Error(firstError.msg);
    }
    throw new Error(errData.message || "상품 등록에 실패했습니다.");
  }

  return (data as CreateProductResponse).item;
}
