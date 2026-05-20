import { useState } from "react"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useLogin } from "~/features/auth"

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

type LoginFormData = z.infer<typeof formSchema>

/**
 * Extracts error message from axios or generic error
 */
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Login failed"
  }
  return "An unexpected error occurred"
}

export default function Home() {
  const loginMutation = useLogin()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function onSubmit(data: LoginFormData) {
    setErrorMessage(null)
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        // Handle successful login - store tokens, redirect, etc.
        localStorage.setItem("accessToken", response.accessToken)
        localStorage.setItem("refreshToken", response.refreshToken)
      },
      onError: (error) => {
        setErrorMessage(getErrorMessage(error))
      },
    })
  }

  return (
    <div className="flex min-h-svh p-6">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Please enter your credentials to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="home-form" onSubmit={form.handleSubmit(onSubmit)}>
            {errorMessage && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your username"
                      autoComplete="username"
                      disabled={loginMutation.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loginMutation.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset()
                setErrorMessage(null)
              }}
              disabled={loginMutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="home-form"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
