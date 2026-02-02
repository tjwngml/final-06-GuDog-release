// 답글(댓글) 작성자 정보
export interface ReplyUser {
  _id: number;
  name: string;
  email?: string;
  image?: string;
}

// 답글(댓글) 인터페이스
export interface Reply {
  _id: number;
  content: string;
  user: ReplyUser;
  createdAt: string;
  updatedAt: string;
}

// Q&A 추가 정보 (상품 정보 및 태그)
export interface PostExtra {
  product_name?: string;
  product_info?: string;
  product_id?: string | number;
  product_img?: string;
  tag?: string[];
}

// 게시글(Q&A) 작성자 요약 정보
export interface PostUser {
  _id: number;
  name: string;
  image?: string;
}

// 개별 게시글 인터페이스
export interface Post {
  _id: number;
  type: "qna"; // 데이터상 "qna" 확인
  product_id?: number;
  views: number;
  user: PostUser;
  title: string;
  content: string;
  extra?: PostExtra;
  replies?: Reply[];
  createdAt: string;
  updatedAt: string;
  repliesCount?: number;
}
