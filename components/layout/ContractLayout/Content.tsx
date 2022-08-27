import Breadcrumbs from "../../common/Breadcrumb";

export function Content({ children }: { children: JSX.Element }) {
  return (
    <main className="px-4 pt-6 pb-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <Breadcrumbs />
      </div>

      {children}
    </main>
  );
}
