import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

export default function useQueryString() {
  const searchParams = useSearchParams();

  const updateQueryString = useCallback(
    (params: Record<string, string>) => {
      const _params = new URLSearchParams(searchParams);

      const queryString = Object.entries({
        ...Object.fromEntries(_params),
        ...params,
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      return queryString;
    },
    [searchParams]
  );

  return { updateQueryString };
}
