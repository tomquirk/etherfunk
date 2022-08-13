import { FormEventHandler, useState } from "react";
import { Button } from "./Button";

export function LoadContractForm({
  onSubmit,
}: {
  onSubmit: (values: { address: string }) => void;
}) {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const _onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);
    return onSubmit({ address });
  };

  return (
    <form onSubmit={_onSubmit}>
      <label htmlFor="address" className="sr-only">
        Contract address
      </label>
      <input
        onChange={(e) => setAddress(e.target.value)}
        type="text"
        placeholder="Contract address"
        id="address"
        name="address"
        autoComplete="off"
        required
        className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full px-5 text-md border border-slate-500 rounded-md bg-transparent text-black mb-3"
      ></input>
      <Button
        loading={loading}
        className="w-full  px-5 py-3 text-base font-medium rounded-md"
      >
        Load it up
      </Button>
    </form>
  );
}
