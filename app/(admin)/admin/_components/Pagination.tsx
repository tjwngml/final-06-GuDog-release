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
  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        총 {totalCount}
        {label}
      </p>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
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
        ))}

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
