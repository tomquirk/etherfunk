import { Spinner } from "./Spinner";

export function Button({
  loading,
  children,
  ...props
}: Omit<React.HTMLProps<HTMLButtonElement>, "type"> & { loading?: boolean }) {
  const className =
    "bg-blue-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center items-center text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" +
    ` ${props.className} ${
      props.disabled ? "bg-gray-400" : " hover:bg-blue-600"
    }`;

  return (
    <button {...props} type="submit" className={className}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}
