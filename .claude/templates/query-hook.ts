import { useQuery } from "@tanstack/react-query"
import { apiClient } from "~/lib/api"

export const fetchX = async () => {
  const res = await apiClient.get("/x")
  return res.data
}

export const useX = () =>
  useQuery({
    queryKey: ["x"],
    queryFn: () => fetchX(),
  })
