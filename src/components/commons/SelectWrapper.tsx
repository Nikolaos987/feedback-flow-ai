import type { AriaAttributes, ComponentProps } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export type Item = {
  value: string | number;
  label: string;
  // count?: string | number;
};

export interface FiltersProps extends ShadcnSelectProps {
  items?: Item[];
  className?: string;
  search?: boolean;
}

export type ShadcnSelectProps = ComponentProps<typeof Select>;

export default function SelectWrapper({
  items,
  className,
  ...props
}: FiltersProps & AriaAttributes) {
  return (
    <Select {...props}>
      <SelectTrigger aria-invalid={props["aria-invalid"]} className={className}>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {items && items.length > 0 ? (
          items?.map((item) => (
            <SelectItem key={String(item.value)} value={String(item.value)}>
              {item.label}
            </SelectItem>
          ))
        ) : (
          <SelectItem key="no-data" value="__no_data__" disabled>
            No options to show...
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
