import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useMemo } from "react";

export type ContractFunction = any;

export const ContractContext: React.Context<{
  functions?: ContractFunction[];
  abi?: any | undefined;
  metadata?: {
    name: string;
  };
  currentFunction?: ContractFunction | undefined;
  contractAddress?: string | undefined;
}> = createContext({});

export function ContractContextProvider({
  functions,
  abi,
  metadata,
  children,
}: PropsWithChildren<{
  functions?: ContractFunction[];
  abi?: any;
  metadata?: {
    name: string;
  };
}>) {
  const router = useRouter();

  const { address: contractAddress, fn } = router.query;

  const currentFunction = useMemo(
    () => functions?.find((f: any) => f.name === fn),
    [fn, functions]
  );

  return (
    <ContractContext.Provider
      value={{
        functions,
        abi,
        metadata,
        currentFunction,
        contractAddress: contractAddress as string,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}
