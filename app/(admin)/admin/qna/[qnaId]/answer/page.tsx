import AnswerForm from "@/app/(admin)/admin/_components/AnswerForm";
import { getPost, getProduct } from "@/lib";
import { notFound } from "next/navigation";

interface QnAAnswerPageProps {
  params: Promise<{ qnaId: string }>;
}

export default async function AnswerPage({ params }: QnAAnswerPageProps) {
  const { qnaId } = await params;

  // QnA 게시글 조회
  const qnaRes = await getPost(qnaId);

  if (qnaRes.ok === 0) {
    notFound();
  }

  const questionData = qnaRes.item;

  // product_id 체크
  if (!questionData.product_id) {
    notFound();
  }

  // 연결된 상품 조회
  const productRes = await getProduct(questionData.product_id);

  if (productRes.ok === 0) {
    notFound();
  }

  const productData = productRes.item;

  return <AnswerForm postId={qnaId} questionData={questionData} productData={productData} />;
}
