import type { Control } from "react-hook-form";

export interface IInputFieldProps {
  placeholder?: string;
  type?: string;
  withAsterisk?: boolean;
  name: string;
  label?: string;
  control: Control<any>;
  disabled?: boolean;
}
