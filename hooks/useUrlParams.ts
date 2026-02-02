import { useSearchParams, useRouter } from "next/navigation";

export function useUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`);
  };

  const getParam = (key: string, defaultValue: string = "") => {
    return searchParams.get(key) || defaultValue;
  };

  return { updateParams, getParam, searchParams };
}
