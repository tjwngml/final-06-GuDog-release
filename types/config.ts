// 서비스 전역 설정 인터페이스
export interface SystemConfig {
  _id: "shippingFees" | "freeShippingFees" | string; // 고정된 키 값들
  title: string; // 설정 명칭 (예: "배송비")
  value: number; // 설정값 (예: 3500)
  createdAt: string;
  updatedAt: string;
}
