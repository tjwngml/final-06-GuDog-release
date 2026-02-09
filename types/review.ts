export interface ReviewUser {
  _id: number;
  name: string;
  image?: string | null;
}

export interface ReviewExtra {
  title?: string;
  createdAt?: string;
  likeCount?: string | number;
  helpfulVoters?: number[];
  price?: string | number;
  reviewId?: string | number;
  image?: { path: string; name: string };
}

// 리뷰에 포함된 상품 요약 정보
export interface ReviewProduct {
  _id: number;
  image: { path: string; name: string } | null;
  name: string;
}

export interface Review {
  _id: number;
  user_id: number;
  user: ReviewUser;
  order_id: number;
  product_id: number;
  rating: number;
  content: string;
  extra?: ReviewExtra;
  createdAt: string;
  product: ReviewProduct;
  updatedAt?: string;
}
