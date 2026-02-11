import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import ProductImage from "@/components/common/ProductImage";

interface ProductCardProps {
  image: string;
  title: string;
  kcal: string;
  description: string;
  tag: string;
  href: string;
}

export default function ProductCard({
  image,
  title,
  kcal,
  description,
  tag,
  href,
}: ProductCardProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-[49px] shadow-[0px_4px_24px_-4px_rgba(0,0,0,0.04),0px_0px_0px_1px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* 이미지 영역 */}
      <div className="relative">
        <ProductImage src={image} alt={title} />
        {tag && (
          <Badge className="absolute top-8 right-8" variant="accent">
            {tag}
          </Badge>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-[42px] flex flex-col gap-[21px] flex-1">
        {/* 타이틀 + kcal */}
        <div className="flex gap-4 flex-wrap items-center">
          <h3 className="text-[24.5px] font-black text-[#1A1A1C] tracking-[-1.3px] leading-8">
            {title}
          </h3>
          <span className="ml-auto text-xs font-extrabold text-accent-primary">{kcal}</span>
        </div>

        {/* 설명 */}
        <p className="text-sm font-medium text-[#646468] leading-[160%] line-clamp-2">
          {description}
        </p>

        {/* 버튼 */}
        <div className="flex justify-between items-center mt-auto pt-7 border-t border-black/6">
          <Button href={href} variant="secondary" size="md" rightIcon className="w-full">
            상세 정보
          </Button>
        </div>
      </div>
    </div>
  );
}
