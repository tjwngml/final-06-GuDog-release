import ProductDetail from "@/app/(main)/products/_components/ProductDetail";
import { getPosts, getReplies } from "@/lib/post";
import { getProduct } from "@/lib/product";

interface Props {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{
    reviewPage?: string;
    qnaPage?: string;
    reviewFilter?: string;
  }>;
}

// 상품 상세페이지
export default async function ProductPage({ params, searchParams }: Props) {
  const { productId } = await params;
  const { reviewPage, qnaPage, reviewFilter } = await searchParams;

  const currentReviewPage = Number(reviewPage) || 1;
  const currentQnaPage = Number(qnaPage) || 1;
  const currentReviewFilter = reviewFilter === "photo" ? "photo" : "latest";

  // 리뷰,qna 목록 갯수
  const REVIEW_PER_PAGE = 5;
  const QNA_PER_PAGE = 5;

  const data = await getProduct(Number(productId));
  if (data.ok === 0) {
    return <div>{data.message}</div>;
  }
  const product = data.item;

  // 리뷰 목록
  const allReviews = product.replies ?? [];

  // 최신순 정렬 또는 사진후기만(필터링)
  let filteredReviews = [...allReviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (currentReviewFilter === "photo") {
    filteredReviews = filteredReviews.filter((review) => review.product?.image);
  }

  const reviewTotalPages = Math.max(1, Math.ceil(filteredReviews.length / REVIEW_PER_PAGE));

  // qna 목록
  const qnaData = await getPosts({
    boardType: "qna",
    custom: { product_id: Number(productId) },
  });

  const qnaList = qnaData.ok === 1 ? qnaData.item : [];

  // 각 QnA의 replies를 가져옴
  const qna = await Promise.all(
    qnaList.map(async (post) => {
      const repliesData = await getReplies({ _id: post._id });
      return {
        ...post,
        replies: repliesData.ok === 1 ? repliesData.item : [],
      };
    }),
  );

  const qnaTotalPages = Math.max(1, Math.ceil(qna.length / QNA_PER_PAGE));

  return (
    <ProductDetail
      product={product}
      productId={Number(productId)}
      reviews={filteredReviews.slice(
        (currentReviewPage - 1) * REVIEW_PER_PAGE,
        currentReviewPage * REVIEW_PER_PAGE,
      )}
      qna={qna.slice((currentQnaPage - 1) * QNA_PER_PAGE, currentQnaPage * QNA_PER_PAGE)}
      currentReviewPage={currentReviewPage}
      currentQnaPage={currentQnaPage}
      reviewTotalPages={reviewTotalPages}
      qnaTotalPages={qnaTotalPages}
      reviewCount={allReviews.length}
      reviewFilter={currentReviewFilter}
      qnaCount={qna.length}
    />
  );
}
