import type { Control } from "react-hook-form";

export interface ISelectFieldProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  withAsterisk?: boolean;
  disabled?: boolean;
  data: { value: string; label: string }[];
  [key: string]: any;
}
