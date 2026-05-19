import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("products", "routes/products/index.tsx", [
    route("add", "routes/products/add.tsx"),
  ]),
] satisfies RouteConfig
