// 개별 장바구니 아이템 인터페이스
export interface Cart {
  _id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
