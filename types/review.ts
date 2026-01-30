// 후기 작성자 요약 정보
export interface ReviewUser {
  _id: number;
  name: string;
  image?: string | null;
}

// 후기 추가 정보 (데이터마다 필드가 다르므로 모두 선택 사항으로 정의)
export interface ReviewExtra {
  title?: string;
  createdAt?: string;
  likeCount?: string | number;
  price?: string | number;
  reviewId?: string | number;
}

// 개별 후기 인터페이스
export interface Review {
  _id: number;
  user_id: number;
  user: ReviewUser;
  order_id: number;
  product_id: number;
  rating: number; // 1 ~ 5
  content: string;
  extra?: ReviewExtra;
  createdAt: string;
  updatedAt?: string; // 일부 데이터에 없을 수 있음
}
