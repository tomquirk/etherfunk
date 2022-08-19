import { ButtonHTMLAttributes } from "react";
import { Spinner } from "../Spinner";

const BASE_CLASSES =
  "border rounded-md shadow-sm inline-flex justify-center items-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

const VARIANT_CLASSES = {
  primary: "bg-blue-700 hover:bg-blue-600 border-transparent text-white",
  secondary: "bg-white hover:bg-gray-50 border-gray-300 text-gray-700",
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
  variant?: "primary" | "secondary";
  size?: "medium" | "large";
}) {
  const className = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${
    SIZE_CLASSES[size]
  } ${props.className} ${props.disabled ? "bg-gray-400" : ""}`;

  return (
    <button {...props} className={className}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}
