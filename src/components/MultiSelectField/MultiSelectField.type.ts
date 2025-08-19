import type { Control } from "react-hook-form";

export interface IMultiSelectFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  withAsterisk?: boolean;
  disabled?: boolean;
  data: { value: string; label: string }[] | string[];
  [key: string]: any;
}
