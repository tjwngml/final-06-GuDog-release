import useUserStore from "@/app/(main)/(auth)/login/zustand/useStore";
import { ProductImage } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

interface UploadResponse {
  ok: 1;
  item: ProductImage[];
}

interface UploadErrorResponse {
  ok: 0;
  message: string;
}

/**
 * 파일 업로드 (POST /files/)
 * - 한번에 최대 10개까지 가능
 * - 필드명: attach
 * - 응답: { name, path }[] 배열
 */
export async function uploadFiles(files: File[]): Promise<ProductImage[]> {
  const token = useUserStore.getState().user?.token?.accessToken;

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("attach", file);
  });

  const res = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      "client-id": CLIENT_ID,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data: UploadResponse | UploadErrorResponse = await res.json();

  if (!res.ok || data.ok !== 1) {
    throw new Error((data as UploadErrorResponse).message || "파일 업로드에 실패했습니다.");
  }

  return (data as UploadResponse).item;
}
