import { apiClient } from "~/lib/api"
import type { LoginRequest, LoginResponse } from "../types"

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>("/auth/login", data)
  return res.data
}
