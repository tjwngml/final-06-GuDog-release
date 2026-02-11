import ReviewImage from "@/components/common/ReviewImage";
import ProductImage from "@/components/common/ProductImage";
import Link from "next/link";
import { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="bg-white rounded-[3rem] border border-border-primary overflow-hidden hover:shadow-card hover:border-accent-primary/20 transition-all duration-500 flex flex-col group">
      <div className="aspect-1 overflow-hidden bg-bg-warm relative">
        <ReviewImage src={review.extra?.image?.path || ""} alt="review" className="w-full" />
        <div className="absolute top-6 left-6">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1">
            <span className="text-accent-primary font-black">★</span>
            <span className="text-xs font-black text-text-primary">{review.rating}.0</span>
          </div>
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-black text-text-primary tracking-tight line-clamp-1">
            {review.extra?.title}
          </h4>
        </div>

        <p className="text-sm font-medium text-text-secondary leading-relaxed mb-6 line-clamp-3">
          {review.content}
        </p>

        <div className="mt-auto space-y-4">
          <Link
            href={`/products/${review?.product?._id}`}
            className="w-full flex items-center space-x-4 p-4 bg-bg-secondary rounded-2xl border border-transparent hover:border-accent-soft cursor-pointer transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative">
              <ProductImage src={review?.product?.image?.path || ""} alt="product" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-0.5">
                PURCHASED ITEM
              </p>
              <p className="text-xs font-black text-text-primary truncate">{review.product.name}</p>
            </div>
          </Link>

          <div className="flex items-center justify-between pt-4 border-t border-border-primary">
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
              {review.user.name} | {review.createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
