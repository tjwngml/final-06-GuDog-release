"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/common/Pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  paramKey?: string;
  scrollTop?: boolean;
}

const PaginationWrapper = ({
  currentPage,
  totalPages,
  paramKey = "page",
  scrollTop = true,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, String(page));
    router.push(`?${params.toString()}`, { scroll: scrollTop });
  };

  return (
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
  );
};

export default PaginationWrapper;
