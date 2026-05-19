/**
 * API Integration Patterns for Service Layer and React Query
 * Follow these patterns for consistent API integration
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "~/lib/api"
import * as z from "zod"

// ============================================================================
// SERVICE LAYER STRUCTURE
// ============================================================================
/**
 * Create `features/[feature]/services/index.ts` with this pattern
 */
export const exampleService = {
  // Query methods
  getList: async (params?: { skip?: number; limit?: number }) => {
    const { data } = await apiClient.get("/endpoint", { params })
    return data // Transformed response
  },

  // Mutation methods
  create: async (payload: { title: string; description: string }) => {
    const { data } = await apiClient.post("/endpoint", payload)
    return data // Transformed response
  },

  update: async (
    id: string,
    payload: { title: string; description: string }
  ) => {
    const { data } = await apiClient.put(`/endpoint/${id}`, payload)
    return data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/endpoint/${id}`)
  },
}

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================
/**
 * Define at top of `features/[feature]/hooks/index.ts`
 * Export for use in components and mutations
 */
export const exampleQueryKeys = {
  all: ["example"] as const,
  lists: () => [...exampleQueryKeys.all, "list"] as const,
  list: (filters: string) =>
    [...exampleQueryKeys.lists(), { filters }] as const,
  details: () => [...exampleQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...exampleQueryKeys.details(), id] as const,
}

// ============================================================================
// REACT QUERY HOOKS - QUERIES
// ============================================================================
/**
 * Use in components to fetch data
 */
export function useExampleList(params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: exampleQueryKeys.list(JSON.stringify(params || {})),
    queryFn: () => exampleService.getList(params),
  })
}

// ============================================================================
// REACT QUERY HOOKS - MUTATIONS
// ============================================================================
/**
 * Use in components to create/update/delete data
 * Always invalidate the query key on success
 */
export function useExampleCreate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exampleService.create,
    onSuccess: () => {
      // Invalidate list query to refetch
      queryClient.invalidateQueries({
        queryKey: exampleQueryKeys.lists(),
      })
    },
  })
}

export function useExampleUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      exampleService.update(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate both list and specific item
      queryClient.invalidateQueries({
        queryKey: exampleQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: exampleQueryKeys.detail(variables.id),
      })
    },
  })
}

export function useExampleDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exampleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exampleQueryKeys.lists(),
      })
    },
  })
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Define in `features/[feature]/types/index.ts`
 * Separate schemas for API responses and mutation inputs
 */

// API Response Types
export const ExampleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type Example = z.infer<typeof ExampleSchema>

// Mutation Input Types
export const CreateExampleSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
})
export type CreateExample = z.infer<typeof CreateExampleSchema>

export const UpdateExampleSchema = CreateExampleSchema.partial()
export type UpdateExample = z.infer<typeof UpdateExampleSchema>

// ============================================================================
// ERROR HANDLING PATTERN
// ============================================================================
/**
 * Transform raw API errors to user-friendly messages
 * Keep in service layer or separate error utility
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    // Network error
    if (error.message.includes("Network")) {
      return "Network error. Please check your connection."
    }
    // API error with message
    return error.message
  }
  return "An unexpected error occurred. Please try again."
}

// Usage in component:
// const { mutate: create } = useExampleCreate()
// create(payload, {
//   onError: (error) => {
//     toast.error(handleApiError(error))
//   },
// })
