import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const maxVisible = 5;

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    // 양쪽 끝에 가까울 때 보정
    if (currentPage <= half + 1) {
      end = maxVisible - 1;
    }
    if (currentPage >= totalPages - half) {
      start = totalPages - maxVisible + 2;
    }

    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const baseButtonClass =
    "inline-flex h-10.5 w-10.5 items-center justify-center rounded-[0.875rem] border p-0 leading-none transition-[background-color]";

  const activeClass = "border-transparent bg-[#FBA613] text-white shadow-md cursor-pointer";
  const inactiveClass =
    "border-black/10 bg-white text-black cursor-pointer hover:bg-gray-50 focus-visible:text-accent-primary focus-visible:border-accent-primary";
  const disabledClass = "border-black/10 bg-[#F2F2F2] text-[#646468] cursor-not-allowed";

  return (
    <nav className={`max-w-full ${className}`}>
      <ul className="flex flex-wrap w-full items-center justify-center gap-1.75 pt-3.5 font-semibold">
        {/* 이전 버튼 */}
        <li>
          <button
            type="button"
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`${baseButtonClass} ${isFirstPage ? disabledClass : inactiveClass}`}
            aria-disabled={isFirstPage}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
        </li>

        {/* 페이지 번호 */}
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <li
                key={`ellipsis-${idx}`}
                className="inline-flex h-10.5 w-10.5 items-center justify-center text-black/40"
              >
                &hellip;
              </li>
            );
          }

          const isActive = currentPage === page;

          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`${baseButtonClass} ${isActive ? activeClass : inactiveClass}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* 다음 버튼 */}
        <li>
          <button
            type="button"
            onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            disabled={isLastPage}
            className={`${baseButtonClass} ${isLastPage ? disabledClass : inactiveClass}`}
            aria-disabled={isLastPage}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
