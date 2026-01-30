// 즐겨찾기를 한 유저 정보
export interface BookmarkUser {
  _id: number;
  name: string;
  image?: string;
}

// 추가 정보 (관련된 상품이나 포스트 ID)
export interface BookmarkExtra {
  product_id?: string | number;
  post_id?: string | number;
}

// 개별 즐겨찾기 인터페이스
export interface Bookmark {
  _id: number;
  user_id: number;
  user: BookmarkUser;
  type: "product"; // 찜한 대상의 타입
  target_id: number; // 해당 상품이나 게시글의 _id
  is_like?: "true"; // 데이터상 문자열 "true"로 들어옴
  memo?: string;
  extra?: BookmarkExtra;
  createdAt: string;
  updatedAt: string;
}
