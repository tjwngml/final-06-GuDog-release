"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductFrom from "@/app/(admin)/admin/_components/ProductForm";
import { getProduct } from "@/lib/product";
import { Product } from "@/types/product";

export default function ProductEditPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await getProduct(Number(productId));
        if (res.ok === 1) {
          setProduct(res.item);
        }
      } catch (error) {
        console.error("상품 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  return <ProductFrom formType="modify" initialData={product} />;
}
