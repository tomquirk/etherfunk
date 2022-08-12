import { FormEventHandler, useState } from "react";

export function LoadContractForm({
  onSubmit,
}: {
  onSubmit: (values: { address: string }) => void;
}) {
  const [address, setAddress] = useState<string>("");

  const _onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    return onSubmit({ address });
  };

  return (
    <form onSubmit={_onSubmit}>
      <label htmlFor="address" className="block text-lg">
        Load a contract
      </label>
      <input
        onChange={(e) => setAddress(e.target.value)}
        type="text"
        placeholder="0x00..."
        id="address"
        name="address"
        autoComplete="off"
        className="focus:ring-sky-500 py-3 focus:border-sky-500 block w-full pl-7 text-md border border-slate-500 rounded-md bg-transparent text-black mb-3"
      ></input>
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600"
      >
        Load it up
      </button>
    </form>
  );
}
