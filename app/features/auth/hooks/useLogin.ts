import { useMutation } from "@tanstack/react-query"
import { login } from "../api"
import type { LoginRequest, LoginResponse } from "../types"

export const useLogin = () =>
  useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data) => login(data),
  })
