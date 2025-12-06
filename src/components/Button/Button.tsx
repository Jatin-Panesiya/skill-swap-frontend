import { Button as MantineButton, Loader } from "@mantine/core";
import type { ButtonProps as MantineButtonProps } from "@mantine/core";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps extends Omit<MantineButtonProps, "variant"> {
  variant?: ButtonVariant;
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  variant = "primary",
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  size = "md",
  ...rest
}: ButtonProps) => {
  const getButtonStyles = (isFullWidth: boolean) => {
    const getPadding = () => {
      switch (size) {
        case "xs":
          return "0.5rem 0.75rem";
        case "sm":
          return "0.625rem 1rem";
        case "lg":
          return "0.875rem 1.5rem";
        default:
          return "0.75rem 1.25rem";
      }
    };

    const baseStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "1.5",
      borderRadius: "0.5rem",
      padding: getPadding(),
      fontWeight: 500,
      border: "none",
      transition: "all 0.2s ease",
      height: "auto",
      minHeight: "auto",
      width: isFullWidth ? "100%" : "auto",
    };

    switch (variant) {
      case "primary":
        return {
          root: {
            ...baseStyles,
            backgroundColor: "#6366F1",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#4F46E5",
            },
            "&:disabled": {
              backgroundColor: "#94A3B8",
              cursor: "not-allowed",
            },
          },
          label: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            lineHeight: "1.5",
          },
          inner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          },
        };
      case "secondary":
        return {
          root: {
            ...baseStyles,
            backgroundColor: "#F1F5F9",
            color: "#0F172A",
            border: "1px solid #CBD5E1",
            "&:hover": {
              backgroundColor: "#E2E8F0",
            },
            "&:disabled": {
              backgroundColor: "#F1F5F9",
              color: "#94A3B8",
              cursor: "not-allowed",
            },
          },
          label: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            lineHeight: "1.5",
          },
          inner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          },
        };
      case "danger":
        return {
          root: {
            ...baseStyles,
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#DC2626",
            },
            "&:disabled": {
              backgroundColor: "#94A3B8",
              cursor: "not-allowed",
            },
          },
          label: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            lineHeight: "1.5",
          },
          inner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          },
        };
      default:
        return {
          root: baseStyles,
          label: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            lineHeight: "1.5",
          },
          inner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          },
        };
    }
  };

  const buttonStyles = getButtonStyles(fullWidth);

  return (
    <MantineButton
      {...rest}
      variant={variant === "secondary" ? "outline" : "filled"}
      disabled={disabled || loading}
      loading={loading}
      fullWidth={fullWidth}
      size={size}
      styles={{
        ...buttonStyles,
        root: {
          ...buttonStyles.root,
          height: "auto",
          minHeight: "auto",
        },
        inner: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        },
      }}
      loaderProps={{
        size: "sm",
        color: variant === "secondary" ? "#0F172A" : "#FFFFFF",
      }}
    >
      {children}
    </MantineButton>
  );
};

export default Button;

