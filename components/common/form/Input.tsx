import { InputHTMLAttributes } from "react";

const BASE_CLASS =
  "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-slate-300 rounded-md";

const SIZE_CLASSES = {
  medium: "py-2 px-4 text-sm",
  large: "py-3 px-5 text-md",
};

export function Input({
  size = "medium",
  ...props
}: { size?: "medium" | "large" } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
>) {
  const className = `${BASE_CLASS} ${SIZE_CLASSES[size]} ${props.className}`;

  return <input {...props} className={className} />;
}
