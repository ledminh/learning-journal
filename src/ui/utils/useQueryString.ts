import { useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function useQueryString() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const addQueryString = useCallback(
    (params: Record<string, string>) => {
      const _params = new URLSearchParams(searchParams);

      const queryString = Object.entries({
        ...Object.fromEntries(_params),
        ...params,
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      router.push(pathname + "?" + queryString);
    },
    [searchParams]
  );

  const deleteQueryString = useCallback(
    (params: string[]) => {
      const _params = new URLSearchParams(searchParams);
      params.forEach((param) => _params.delete(param));

      if (_params.toString() === "") {
        router.push(pathname);
        return;
      }

      const queryString = _params.toString();

      router.push(pathname + "?" + queryString);
    },
    [searchParams]
  );

  return { addQueryString, deleteQueryString };
}
