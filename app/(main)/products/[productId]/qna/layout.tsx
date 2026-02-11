import { getProduct } from "@/lib";

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  const res = await getProduct(Number(productId));

  if (res.ok === 1 && res.item) {
    const product = res.item;
    return {
      title: `${product.name} 문의하기`,
      description: `${product.name}에 대해 궁금한 점을 문의하세요.`,
    };
  }
}

export default function ProductQnaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
