import ProductDetail from "@/app/(main)/products/_components/ProductDetail";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    reviewPage?: string;
    qnaPage?: string;
  }>;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { reviewPage, qnaPage } = await searchParams;

  const currentReviewPage = Number(reviewPage) || 1;
  const currentQnaPage = Number(qnaPage) || 1;

  // 임시 값 (나중에 API 연결)
  const reviewTotalPages = 5;
  const qnaTotalPages = 3;

  return (
    <ProductDetail
      productId={id}
      currentReviewPage={currentReviewPage}
      currentQnaPage={currentQnaPage}
      reviewTotalPages={reviewTotalPages}
      qnaTotalPages={qnaTotalPages}
    />
  );
}
