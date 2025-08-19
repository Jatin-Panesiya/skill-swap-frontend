import { PasswordInput, TextInput } from "@mantine/core";
import { useController } from "react-hook-form";
import type { IInputFieldProps } from "./InputField.type";

const InputField = ({
  placeholder,
  type = "text",
  withAsterisk = false,
  name,
  control,
  disabled = false,
  ...rest
}: IInputFieldProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <>
      {type === "password" ? (
        <PasswordInput
          {...field}
          placeholder={placeholder}
          type={type}
          withAsterisk={withAsterisk}
          error={error?.message}
          disabled={disabled}
          classNames={{
            input: "bg-white/50 backdrop-blur-md",
          }}
          {...rest}
        />
      ) : (
        <TextInput
          {...field}
          placeholder={placeholder}
          type={type}
          withAsterisk={withAsterisk}
          error={error?.message}
          disabled={disabled}
          classNames={{
            input: "bg-white/50 backdrop-blur-md",
          }}
          {...rest}
        />
      )}
    </>
  );
};

export default InputField;
