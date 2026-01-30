// 개별 코드 항목 인터페이스
export interface CodeItem {
  sort: number;
  code: string;
  value: string;
  depth?: number; // 카테고리에서 사용
  parent?: string; // 카테고리에서 사용
  discountRate?: number; // 회원 등급에서 사용
}

// 코드 그룹 전체 인터페이스
export interface CodeGroup {
  _id: "productCategory" | "orderState" | "membershipClass";
  title: string;
  codes: CodeItem[];
  createdAt: string;
  updatedAt: string;
}

// 1. 상품 카테고리 전용
export interface CategoryCode extends CodeItem {
  depth: number;
  parent?: string;
}

// 2. 회원 등급 전용
export interface MembershipCode extends CodeItem {
  discountRate: number;
}

// 3. 주문 상태 코드 (유니온 타입으로 관리하면 편리함)
export type OrderStateCode =
  | "OS010"
  | "OS020"
  | "OS030"
  | "OS035"
  | "OS040" // 정상 프로세스
  | "OS110"
  | "OS120"
  | "OS130" // 반품
  | "OS210"
  | "OS220"
  | "OS230" // 교환
  | "OS310"
  | "OS320"
  | "OS330"; // 환불
