import type React from "react"
import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Skeleton } from "~/components/ui/skeleton"
import type { Product } from "~/features/dashboard/products"

interface ProductDetailProps {
  product: Product
}

function RatingStars({ rating }: Readonly<{ rating: number }>): React.JSX.Element {
  return (
    <span className="flex items-center gap-0.5">
      {([1, 2, 3, 4, 5] as const).map((n) => (
        <span
          key={n}
          className={`text-sm ${n <= Math.round(rating) ? "text-yellow-400" : "text-muted-foreground"}`}
        >
          ★
        </span>
      ))}
    </span>
  )
}

function TagBadge({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
      {children}
    </span>
  )
}

function InfoRow({
  label,
  value,
}: Readonly<{
  label: string
  value: string | number
}>): React.JSX.Element {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function ReviewerAvatar({ name }: Readonly<{ name: string }>): React.JSX.Element {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
      {initials}
    </div>
  )
}

export function ProductDetail({
  product,
}: Readonly<ProductDetailProps>): React.JSX.Element {
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100)

  let availabilityClass: string
  if (product.availabilityStatus === "In Stock") {
    availabilityClass =
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  } else if (product.availabilityStatus === "Low Stock") {
    availabilityClass =
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  } else {
    availabilityClass =
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm">
          <Link
            to="/dashboard/products"
            className="flex items-center gap-1"
          >
            ← Back to Products
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Image */}
            <div className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-lg border bg-muted">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-72 w-full object-contain p-4"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <div
                      key={img || i}
                      className="shrink-0 overflow-hidden rounded-md border bg-muted"
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${i + 1}`}
                        className="size-16 object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {product.category}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${availabilityClass}`}
                  >
                    {product.availabilityStatus}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold leading-tight">
                  {product.title}
                </h1>
                {product.brand && (
                  <p className="text-sm text-muted-foreground">
                    by {product.brand}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} / 5
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                      -{product.discountPercentage.toFixed(0)}%
                    </span>
                  </>
                )}
              </div>

              <Separator />

              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <TagBadge key={tag}>{tag}</TagBadge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Stock" value={product.stock} />
            <InfoRow label="Weight" value={`${product.weight} kg`} />
            <InfoRow
              label="Dimensions (W×H×D)"
              value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
            />
            <InfoRow
              label="Min. Order Qty"
              value={product.minimumOrderQuantity}
            />
            <InfoRow label="Warranty" value={product.warrantyInformation} />
            <InfoRow label="Shipping" value={product.shippingInformation} />
            <InfoRow label="Return Policy" value={product.returnPolicy} />
          </div>
        </CardContent>
      </Card>

      {product.reviews.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Reviews ({product.reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {product.reviews.map((review, i) => (
              <div key={review.reviewerEmail}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex gap-3">
                  <ReviewerAvatar name={review.reviewerName} />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">
                        {review.reviewerName}
                      </span>
                      <RatingStars rating={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function ProductDetailSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-36" />
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Skeleton className="h-72 w-full rounded-lg" />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-px w-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <div className="flex gap-2">
                {["tag-1", "tag-2", "tag-3"].map((k) => (
                  <Skeleton key={k} className="h-5 w-16" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {["sku", "stock", "weight", "dimensions", "min-order", "warranty", "shipping", "return"].map((k) => (
              <div key={k} className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProductDetailError({
  message,
}: {
  message?: string
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button variant="ghost" size="sm">
          <Link
            to="/dashboard/products"
            className="flex items-center gap-1"
          >
            ← Back to Products
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <p className="text-lg font-medium">Failed to load product</p>
          <p className="text-sm text-muted-foreground">
            {message ?? "An unexpected error occurred. Please try again."}
          </p>
          <Button variant="outline">
            <Link to="/dashboard/products">Return to Products</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
