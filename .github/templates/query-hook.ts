import { useQuery } from "@tanstack/react-query"
import { apiClient } from "~/lib/api"

export const useX = () =>
  useQuery({
    queryKey: ["x"],
    queryFn: () => apiClient.get("/x").then((r) => r.data),
  })
