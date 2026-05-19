# Spec Generator

Generate structured feature specifications in YAML format. Specs drive all implementation decisions.

## Output Format

YAML file in `.github/specs/[feature].yaml`

## Required Sections

### 1. Feature Overview

```yaml
feature: products
description: Product listing and creation
version: "1.0"
```

### 2. Routes

List ONLY routes required for the feature:

```yaml
routes:
  - path: /products
    page: ProductsList
    component: routes/products/index.tsx
    description: List all products
  - path: /products/add
    page: AddProduct
    component: routes/products/add.tsx
    description: Create new product
```

### 3. API Endpoints

Specify EXACT endpoints and methods:

```yaml
api_endpoints:
  list:
    method: GET
    path: /products
    params:
      - name: limit
        type: number
      - name: skip
        type: number
    response: ProductsResponse
  create:
    method: POST
    path: /products
    body: CreateProduct
    response: Product
```

### 4. Forms

Define form requirements:

```yaml
forms:
  - id: add_product
    route: /products/add
    fields:
      - name: title
        type: text
        required: true
      - name: price
        type: number
        required: true
      - name: description
        type: textarea
        required: false
    validation: CreateProductSchema
    submission: useAddProduct
```

### 5. Data Types

Define request/response types:

```yaml
types:
  Product:
    id: string
    title: string
    price: number
    description: string
  CreateProduct:
    title: string (required)
    price: number (required)
    description: string (optional)
  ProductsResponse:
    products: Product[]
    total: number
    skip: number
    limit: number
```

### 6. Query Keys & Mutations

```yaml
queries:
  getProducts:
    key: ["products"]
    refetch: on_mount, on_window_focus

mutations:
  addProduct:
    invalidates: ["products"]
    redirects_to: /products
    loading_message: "Adding..."
    success_message: "Product added"
```

### 7. UI States

Define error and loading states:

```yaml
states:
  loading: Show skeleton loaders
  error: Display user-friendly error message
  empty: Show empty state with CTA
  success: Navigate and show toast
```

## Validation Rules

- **Spec-Driven**: ONLY implement what's in spec
- **No Extras**: Remove any endpoint/route not listed
- **Exact Names**: Use exact path names for routes
- **Clear Requirements**: No ambiguity in field definitions
- **Type Safety**: All types fully defined with required/optional
- **Query Keys**: Specify exact invalidation rules
- **Error Messages**: Define user-friendly messages upfront

## Before Implementation

Validate spec has:

- [ ] All routes defined with exact paths
- [ ] All API endpoints with methods and params
- [ ] All form fields with types and validation
- [ ] All data types fully specified
- [ ] Query key strategy defined
- [ ] Cache invalidation rules clear
- [ ] No extra features beyond spec
- [ ] State handling documented

Spec prevents back-and-forth by being complete upfront.
