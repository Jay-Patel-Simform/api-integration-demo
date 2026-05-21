import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  layout("layouts/DashboardLayout.tsx", [
    route("dashboard/products", "routes/dashboard/products.tsx"),
  ]),
] satisfies RouteConfig
