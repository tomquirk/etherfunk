import { Spinner } from "../Spinner";

const baseClassName =
  "border rounded-md shadow-sm py-2 px-4 inline-flex justify-center items-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

const VARIANT_CLASSES = {
  primary: "bg-blue-700 hover:bg-blue-600 border-transparent text-white",
  secondary: "bg-white hover:bg-gray-50 border-gray-300 text-gray-700",
};

export function Button({
  loading,
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary";
}) {
  const className = `${baseClassName} ${VARIANT_CLASSES[variant]} ${
    props.className
  } ${props.disabled ? "bg-gray-400" : ""}`;

  return (
    <button {...props} className={className}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}
