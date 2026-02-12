interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  label = "항목",
}: PaginationProps) {
  const maxVisible = 5;

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

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

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex gap-2 md:gap-0 flex-col md:flex-row md:items-center justify-between max-w-full">
      <p className="text-sm text-gray-500 shrink-0 whitespace-nowrap">
        총 {totalCount}
        {label}
      </p>
      <div className="flex flex-wrap space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>

        {getPageNumbers().map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400">
                &hellip;
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
}
