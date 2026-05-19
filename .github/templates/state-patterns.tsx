/**
 * State Management Patterns for Local UI State
 * Use these patterns for filters, pagination, sorting, and modals
 */

import { useCallback, useState } from "react"

const LIMIT = 10

// ============================================================================
// PAGINATION STATE
// ============================================================================
export function PaginationPattern() {
  const [skip, setSkip] = useState(0)
  // const { data } = useProducts(skip, LIMIT)

  const handleNextPage = () => setSkip((prev) => prev + LIMIT)
  const handlePrevPage = () => setSkip((prev) => Math.max(0, prev - LIMIT))

  return { skip, handleNextPage, handlePrevPage }
}

// ============================================================================
// FILTER STATE
// ============================================================================
export function FilterPattern() {
  const [skip, setSkip] = useState(0)
  const [search, setSearch] = useState("")
  // const { data } = useProducts(skip, LIMIT, undefined, search)

  const handleSearch = (value: string) => {
    setSearch(value)
    setSkip(0) // Reset pagination when filter changes
  }

  return { search, handleSearch }
}

// ============================================================================
// MODAL STATE
// ============================================================================
export function ModalPattern() {
  const [isOpen, setIsOpen] = useState(false)

  // Use callback for clean toggle
  const handleOpenModal = useCallback(() => setIsOpen(true), [])
  const handleCloseModal = useCallback(() => setIsOpen(false), [])

  return { isOpen, handleOpenModal, handleCloseModal }
}

// ============================================================================
// SORTING STATE
// ============================================================================
export function SortingPattern() {
  const [sortBy, setSortBy] = useState<"title" | "price">("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column as "title" | "price")
      setSortOrder("asc")
    }
  }

  return { sortBy, sortOrder, handleSort }
}

// ============================================================================
// COMBINED: Pagination + Filter + Sorting
// ============================================================================
export function usePaginationFilterSort(defaultSort: "title" | "price" = "title") {
  const [skip, setSkip] = useState(0)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "price">(defaultSort)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setSkip(0) // Reset pagination
  }, [])

  const handleNextPage = useCallback(() => setSkip((prev) => prev + LIMIT), [])
  const handlePrevPage = useCallback(
    () => setSkip((prev) => Math.max(0, prev - LIMIT)),
    []
  )

  const handleSort = useCallback((column: string) => {
    setSortBy(column as "title" | "price")
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortOrder("asc")
    }
  }, [sortBy])

  return {
    // Pagination
    skip,
    handleNextPage,
    handlePrevPage,
    // Filter
    search,
    handleSearch,
    // Sorting
    sortBy,
    sortOrder,
    handleSort,
  }
}
