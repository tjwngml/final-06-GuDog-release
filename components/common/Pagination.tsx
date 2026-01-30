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

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const baseButtonClass =
    "inline-flex h-10.5 w-10.5 items-center justify-center rounded-[0.875rem] border p-0 leading-none transition-colors";

  const activeClass = "border-transparent bg-[#FBA613] text-white shadow-md cursor-pointer";
  const inactiveClass = "border-black/10 bg-white text-black cursor-pointer hover:bg-gray-50";
  const disabledClass = "border-black/10 bg-[#F2F2F2] text-[#646468] cursor-not-allowed";

  return (
    <nav aria-label="페이지 네비게이션" className={className}>
      <ul className="flex w-full items-center justify-center gap-1.75 pt-3.5 font-semibold">
        {/* 이전 버튼 */}
        <li>
          <button
            type="button"
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`${baseButtonClass} ${isFirstPage ? disabledClass : inactiveClass}`}
            aria-label="이전 페이지로 이동"
            aria-disabled={isFirstPage}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
        </li>

        {/* 페이지 번호 */}
        {getPageNumbers().map((page) => {
          const isActive = currentPage === page;

          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`${baseButtonClass} ${isActive ? activeClass : inactiveClass}`}
                aria-label={`${page}페이지로 이동`}
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
            aria-label="다음 페이지로 이동"
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
