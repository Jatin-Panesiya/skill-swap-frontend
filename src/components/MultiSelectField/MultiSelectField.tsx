import { MultiSelect } from "@mantine/core";
import { useController } from "react-hook-form";
import type { IMultiSelectFieldProps } from "./MultiSelectField.type";

const MultiSelectField = ({
  label,
  placeholder,
  withAsterisk = false,
  name,
  control,
  disabled = false,
  data,
  ...rest
}: IMultiSelectFieldProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <MultiSelect
      {...field}
      label={label}
      placeholder={placeholder}
      withAsterisk={withAsterisk}
      disabled={disabled}
      data={data}
      error={error?.message}
      classNames={{
        input: "bg-white/50 backdrop-blur-md",
      }}
      {...rest}
      value={field.value || []} // MultiSelect expects an array
      onChange={(value) => field.onChange(value)}
    />
  );
};

export default MultiSelectField;
