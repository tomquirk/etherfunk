export function Badge({ children }: { children: JSX.Element | string }) {
  return (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {children}
    </span>
  );
}
