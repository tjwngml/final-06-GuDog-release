import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import type { ProductData } from "@/lib";
import Badge from "@/components/common/Badge";

interface ProductCardProps {
  product: Product | ProductData;
  showLifeStage?: boolean;
  showRanking?: boolean;
  ranking?: number;
}

export default function ProductCard({
  product,
  showLifeStage = true,
  showRanking = false,
  ranking,
}: ProductCardProps) {
  const productId = product?._id;

  return (
    <li className="flex flex-col max-w-[250px] rounded-3xl sm:rounded-[2.1875rem] border border-black/10 bg-white hover:shadow-lg hover:border-accent-soft transition-all group cursor-pointer">
      <Link href={`/products/${productId}`} className="flex w-full flex-col no-underline rounded-3xl sm:rounded-[2.1875rem]">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-t-3xl sm:rounded-t-[2.1875rem] bg-white relative">
          <Image
            src={product.mainImages?.[0]?.path || "/placeholder.png"}
            alt={product.name}
            width={280}
            height={280}
            className="block h-full w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          {showRanking && ranking && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 backdrop-blur-sm">#{ranking}</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 px-3 py-3 sm:px-4 sm:py-4">
          <h3 className="w-full text-base sm:text-lg font-black leading-6 tracking-tight text-text-primary line-clamp-1 break-all">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base font-black leading-6 text-text-secondary">
            {product.price.toLocaleString()}원
          </p>

          {showLifeStage && product.extra?.type === "사료" && "lifeStage" in product.extra && (
            <>
              {product.extra.lifeStage?.map((lifeStage: string) => (
                <span
                  key={lifeStage}
                  className="inline-flex items-center rounded-md bg-orange-500/80 px-2.5 py-1 text-[0.625rem] font-normal uppercase leading-none tracking-wider text-white backdrop-blur-sm"
                >
                  {lifeStage}
                </span>
              ))}
            </>
          )}
        </div>
      </Link>
    </li>
  );
}
