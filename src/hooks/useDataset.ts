import { useQuery } from "@tanstack/react-query";
import { loadDataset, type Dataset } from "@/lib/dataset";

export function useDataset() {
  return useQuery<Dataset>({
    queryKey: ["dataset"],
    queryFn: loadDataset,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });
}
