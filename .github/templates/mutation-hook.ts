import { useMutation } from "@tanstack/react-query"
import { queryClient } from "~/lib/query-client"
import { apiClient } from "~/lib/api"

export const useCreateX = () =>
  useMutation({
    mutationFn: (data: XData) => apiClient.post("/x", data).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["x"] })
    },
  })
