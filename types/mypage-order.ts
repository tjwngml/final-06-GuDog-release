import { Product, ProductExtra, ProductImage } from "./product";

export interface OrderProduct {
  _id: number;
  seller_id: number;
  name: string;
  image: ProductImage;
  price: number;
  quantity: number;
  extra?: ProductExtra;
  seller?: {
    _id: number;
    name: string;
    image: string;
  };

  size?: string | null;
  color?: string | null;
  period?: string;
}

export interface Order {
  orderId: number;
  _id: number;
  user_id: number;
  products: OrderProduct[];
  state: string;
  cost: {
    products: number;
    shippingFees: number;
    discount: {
      products: number;
      shippingFees: number;
    };
    total: number;
  };
  createdAt: string;
  updatedAt: string;
  period: string;
}

export interface OrderListRes {
  ok: number;
  item: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FlattenedOrderProduct extends OrderProduct {
  orderId: number;
  displayDate: string;
}

export interface OrderHistory {
  actor: number;
  updated: {
    state: string;
    memo: string;
  };
  createdAt: string;
}

export interface OrderDetailItem extends Order {
  history: OrderHistory[];
  memo?: string;
  nextdeliverydate?: string;
}

export interface OrderDetailRes {
  ok: number;
  item: OrderDetailItem;
}
