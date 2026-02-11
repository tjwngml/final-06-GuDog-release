import Image from "next/image";

// 공통 타입 정의
interface ImageProps {
  className?: string;
}

export const Product404 = ({ className }: ImageProps) => {
  return <Image src="/images/product-404.jpg" alt="상품 이미지 없음" width={82} height={82} className={className} />;
};
