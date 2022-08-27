import { MenuAlt2Icon, SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { ConnectWalletButton } from "../../common/buttons/ConnectWalletButton";
import { Spinner } from "../../common/Spinner";

export function Header({
  setSidebarOpen,
}: {
  setSidebarOpen: (value: boolean) => void;
}) {
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSearchSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setSearchLoading(true);
    await router.push(`/address/${searchAddress}`);
    setSearchLoading(false);
  };

  return (
    <div className="flex-shrink-0 flex h-16 bg-white border-b border-slate-100">
      <button
        type="button"
        className="px-4 border-r border-slate-100 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex-1 px-4 flex justify-between">
        <form
          className="max-w-md w-full flex md:ml-0"
          onSubmit={onSearchSubmit}
        >
          <label htmlFor="search-field" className="sr-only">
            Load contract address
          </label>
          <div className="relative w-full text-slate-400 focus-within:text-slate-600 lg:ml-4">
            <div className="absolute inset-y-0 left-0 hidden lg:flex items-center pointer-events-none ">
              <SearchIcon className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="flex h-full items-center">
              <input
                id="search-field"
                className="block w-full h-full lg:pl-8 pr-3 py-2 border-transparent text-slate-900 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Load contract address"
                type="search"
                name="search"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
              {searchLoading && <Spinner />}
            </div>
          </div>
        </form>
        <div className="ml-4 flex items-center md:ml-6">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
}
