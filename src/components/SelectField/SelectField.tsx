import { Select } from "@mantine/core";
import { useController } from "react-hook-form";
import type { ISelectFieldProps } from "./SelectField.type";

const SelectField = ({
  placeholder,
  withAsterisk = false,
  name,
  control,
  disabled = false,
  data,
  ...rest
}: ISelectFieldProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Select
      {...field}
      placeholder={placeholder}
      withAsterisk={withAsterisk}
      disabled={disabled}
      data={data}
      error={error?.message}
      classNames={{
        input: "bg-white/50 backdrop-blur-md",
      }}
      {...rest}
      onChange={(value) => field.onChange(value)}
      value={field.value || ""}
    />
  );
};

export default SelectField;
