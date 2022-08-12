export function Button(
  props: Omit<React.HTMLProps<HTMLButtonElement>, "type">
) {
  const className =
    "                   bg-sky-500 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" +
    ` ${props.className}`;

  return <button {...props} type="submit" className={className}></button>;
}
