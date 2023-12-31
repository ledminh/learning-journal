import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

export default function useQueryString() {
  const searchParams = useSearchParams();

  const addQueryString = useCallback(
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

  const deleteQueryString = useCallback(
    (params: string[]) => {
      const _params = new URLSearchParams(searchParams);
      params.forEach((param) => _params.delete(param));
      return _params.toString();
    },
    [searchParams]
  );

  return { addQueryString, deleteQueryString };
}
