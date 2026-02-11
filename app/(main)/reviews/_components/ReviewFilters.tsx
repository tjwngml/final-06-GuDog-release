import Button from "@/components/common/Button";

type SortType = "new" | "old";
type RatingFilter = "all" | "1" | "2" | "3" | "4" | "5";

interface ReviewFiltersProps {
  ratingFilter: RatingFilter;
  sort: SortType;
  isLoading: boolean;
  onRatingFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (sort: SortType) => void;
}

export const ReviewFilters = ({
  ratingFilter,
  sort,
  isLoading,
  onRatingFilterChange,
  onSortChange,
}: ReviewFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6" role="search">
      <div className="relative group w-full md:w-64">
        <label htmlFor="rating-filter" className="sr-only">별점 필터</label>
        <select
          id="rating-filter"
          value={ratingFilter}
          onChange={onRatingFilterChange}
          className="w-full px-8 py-4 bg-white border-2 border-border-primary focus:border-accent-primary rounded-2xl shadow-soft outline-none font-black text-text-primary transition-all appearance-none cursor-pointer"
        >
          <option value="all">전체 별점 보기</option>
          <option value="5">★★★★★ 5점만 보기</option>
          <option value="4">★★★★☆ 4점만 보기</option>
          <option value="3">★★★☆☆ 3점만 보기</option>
          <option value="2">★★☆☆☆ 2점만 보기</option>
          <option value="1">★☆☆☆☆ 1점만 보기</option>
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary group-focus-within:text-accent-primary group-focus-within:rotate-180 transition-all" aria-hidden="true">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="flex items-center space-x-2" role="group">
        <Button
          variant={sort === "new" ? "secondary" : "outline"}
          size="sm"
          onClick={() => onSortChange("new")}
          disabled={isLoading}
          aria-pressed={sort === "new"}
        >
          최신순
        </Button>
        <Button
          variant={sort === "old" ? "secondary" : "outline"}
          size="sm"
          onClick={() => onSortChange("old")}
          disabled={isLoading}
          aria-pressed={sort === "old"}
        >
          오래된순
        </Button>
      </div>
    </div>
  );
};
