import { useSearchParams } from "next/navigation";

export default function useUrlBuilder() {
  const searchParams = useSearchParams();
  return (path: string, params: Record<string, string>) => {
    return `${path}?${new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...params,
    }).toString()}`;
  };
}
