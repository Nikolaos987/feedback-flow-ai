import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";

export interface FormFieldWrapperProps {
  inputType?: string;
  name: string;
  placeholder?: string;
  label?: string;
  description?: string;
}

export default function FormFieldWrapper({
  inputType = "text",
  name,
  placeholder,
  label,
  description,
}: FormFieldWrapperProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            type={inputType}
          />
          {fieldState.error?.message && (
            <p className="text-destructive mt-1 text-sm">{fieldState?.error?.message}</p>
          )}
          <FieldDescription>{description}</FieldDescription>
        </Field>
      )}
    />
  );
}
