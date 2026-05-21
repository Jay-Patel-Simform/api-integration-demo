import { useState } from "react"
import axios from "axios"
import { useDeleteProduct } from "./useProducts"

interface DeleteTarget {
  id: number
  title: string
}

export interface UseProductDeleteReturn {
  deleteTarget: DeleteTarget | null
  open: boolean
  error: string | null
  isPending: boolean
  handleDeleteClick: (id: number, title: string) => void
  handleConfirm: () => void
  handleClose: () => void
}

export function useProductDelete(): UseProductDeleteReturn {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [error, setError] = useState<string | null>(null)
  const deleteMutation = useDeleteProduct()

  const handleDeleteClick = (id: number, title: string): void => {
    setDeleteTarget({ id, title })
    setError(null)
  }

  const handleClose = (): void => {
    if (deleteMutation.isPending) return
    setDeleteTarget(null)
    setError(null)
  }

  const handleConfirm = (): void => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        setError(null)
      },
      onError: (err: unknown) => {
        if (axios.isAxiosError(err)) {
          const msg = (err.response?.data as { message?: string } | undefined)
            ?.message
          setError(msg ?? "Failed to delete product.")
        } else {
          setError("Failed to delete product.")
        }
      },
    })
  }

  return {
    deleteTarget,
    open: deleteTarget !== null,
    error,
    isPending: deleteMutation.isPending,
    handleDeleteClick,
    handleConfirm,
    handleClose,
  }
}
