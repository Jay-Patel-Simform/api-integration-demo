// STRICT FORM TEMPLATE - Required Pattern
// All forms MUST follow this structure exactly

import { useNavigate } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field"
import { type FormData, FormSchema } from "~/features/example/types"
import { useExampleMutation } from "~/features/example/hooks"

export function ExampleForm() {
  const navigate = useNavigate()
  const { mutate: submitForm, isPending } = useExampleMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      field1: "",
      field2: 0,
      field3: "",
    },
  })

  const onSubmit = (data: FormData) => {
    submitForm(data, {
      onSuccess: () => {
        navigate("/example") // Or appropriate redirect
      },
    })
  }

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold">Form Title</h2>
        <p className="text-sm text-muted-foreground">Form description</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* TEXT FIELD PATTERN */}
        <Field>
          <FieldLabel>Field Label *</FieldLabel>
          <FieldContent>
            <Controller
              name="field1"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Placeholder text"
                  aria-invalid={!!errors.field1}
                />
              )}
            />
            {errors.field1 && <FieldError errors={[errors.field1]} />}
          </FieldContent>
        </Field>

        {/* NUMBER FIELD PATTERN */}
        <Field>
          <FieldLabel>Numeric Field *</FieldLabel>
          <FieldContent>
            <Controller
              name="field2"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  aria-invalid={!!errors.field2}
                />
              )}
            />
            {errors.field2 && <FieldError errors={[errors.field2]} />}
          </FieldContent>
        </Field>

        {/* TEXTAREA FIELD PATTERN */}
        <Field>
          <FieldLabel>Text Area</FieldLabel>
          <FieldContent>
            <Controller
              name="field3"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Enter text" rows={4} />
              )}
            />
            {errors.field3 && <FieldError errors={[errors.field3]} />}
          </FieldContent>
        </Field>

        {/* BUTTONS */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Submit"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/example")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
