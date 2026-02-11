import Image from "next/image";

// 공통 타입 정의
interface ImageProps {
  className?: string;
}

export const RigthMark = ({ className }: ImageProps) => {
  return <Image src="/images/right-mark.png" alt="완료 표시" width={24} height={24} className={className} />;
};

export const Pencil = ({ className }: ImageProps) => {
  return <Image src="/images/pencil.png" alt="수정 아이콘" width={24} height={24} className={className} />;
};
