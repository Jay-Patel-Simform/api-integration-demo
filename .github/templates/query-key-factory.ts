export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
}
