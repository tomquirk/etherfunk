import { ButtonHTMLAttributes } from "react";
import { Spinner } from "../Spinner";

const BASE_CLASSES =
  "rounded-md inline-flex justify-center transition-colors items-center font-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

const VARIANT_CLASSES = {
  primary:
    "bg-blue-700 hover:bg-blue-600 border border-transparent text-white shadow-sm",
  secondary:
    "bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-sm",
  tertiary: "bg-transparent hover:bg-gray-200 text-gray-900",
};

const SIZE_CLASSES = {
  medium: "py-2 px-4 text-sm",
  large: "py-3 px-5 text-md",
};

export function Button({
  loading,
  children,
  variant = "primary",
  size = "medium",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "medium" | "large";
}) {
  const className = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${
    SIZE_CLASSES[size]
  } ${props.className} ${props.disabled ? "bg-gray-400" : ""}`;

  return (
    <button {...props} className={className}>
      {loading && <Spinner variant="secondary" />}
      {children}
    </button>
  );
}
