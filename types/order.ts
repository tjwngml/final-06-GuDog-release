import { User } from "./user";

// 주문 내 개별 상품 정보
export interface OrderProduct {
  _id: number;
  seller_id: number;
  state: string; // 예: OS020
  name: string;
  image: {
    path: string;
    name: string;
  };
  quantity: number;
  price: number;
  review_id?: number;
  color?: string;
  size?: string;
}

// 결제 금액 상세 정보
export interface OrderCost {
  products: number;
  shippingFees: number;
  discount: {
    products: number;
    shippingFees: number;
  };
  total: number;
}

// 배송지 정보
export interface OrderAddress {
  name: string;
  value: string;
}

// 주문 상태 변경 이력
export interface OrderHistory {
  actor: number;
  updated: {
    state: string;
    memo?: string;
  };
  createdAt: string;
}

// 전체 주문 인터페이스
export interface Order {
  _id: number;
  user_id: number;
  state: string; // 예: OS110 (반품 요청 등)
  products: OrderProduct[];
  cost: OrderCost;
  address: OrderAddress;
  history: OrderHistory[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  size: string;
  color?: string;
  nextdeliverydate: string;
}

export interface OrderStatistics {
  totalQuantity: number;
  totalSales: number;
  _id?: string | number;
  name?: string;
}
