// 공통 타입 정의
interface ImageProps {
  className?: string;
}

export const Product404 = ({ className }: ImageProps) => {
  return <img src="/images/product-404.jpg" alt="className" />;
};
