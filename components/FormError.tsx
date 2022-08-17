/* This example requires Tailwind CSS v2.0+ */
import { XCircleIcon } from "@heroicons/react/solid";

export function FormError({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="rounded-md bg-red-100 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Transaction failed.
          </h3>
          <div className="mt-2 text-sm text-red-700">{errorMessage}</div>
        </div>
      </div>
    </div>
  );
}
