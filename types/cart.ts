import { Product, ProductImage } from "./product";

// cart 전용 Product타입
export interface CartProduct extends Omit<Product, "mainImages"> {
  image: ProductImage; // mainImages 대신 image 사용
}

// 개별 장바구니 아이템 인터페이스
export interface Cart {
  _id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
  color: string;
  size?: string;
  cost: CartCost;
}

// 장바구니 추가 타입
export interface AddCartItemRequest {
  _id: number;
  quantity: number;
}

// 장바구니 결제 금액 타입
export interface CartCost {
  products: number;
  shippingFees: number;
  discount: {
    products: number;
    shippingFees: number;
  };
  total: number;
}
