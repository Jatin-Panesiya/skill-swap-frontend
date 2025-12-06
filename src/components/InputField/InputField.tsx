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
    fieldState: { error, isTouched },
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
          error={isTouched ? error?.message : undefined}
          disabled={disabled}
          classNames={{
            input: "bg-white/90 border-gray-200 rounded-lg py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
            wrapper: "w-full",
            error: "text-red-500 text-sm mt-1",
          }}
          styles={{
            input: {
              "&:focus": {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
            },
          }}
          {...rest}
        />
      ) : (
        <TextInput
          {...field}
          placeholder={placeholder}
          type={type}
          withAsterisk={withAsterisk}
          error={isTouched ? error?.message : undefined}
          disabled={disabled}
          classNames={{
            input: "bg-white/90 border-gray-200 rounded-lg py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
            wrapper: "w-full",
            error: "text-red-500 text-sm mt-1",
          }}
          styles={{
            input: {
              "&:focus": {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
            },
          }}
          {...rest}
        />
      )}
    </>
  );
};

export default InputField;
