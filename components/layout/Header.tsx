import { Badge } from "../Badge";
import { ConnectWalletButton } from "../common/buttons/ConnectWalletButton";
import { HomepageLink } from "../HomepageLink";

export function Header() {
  return (
    <header className="p-5 h-20 fixed top-0 w-full flex justify-between items-center bg-white border-b border-slate-200">
      <div className="flex items-center">
        <HomepageLink />
        <Badge>Beta</Badge>
      </div>
      <ConnectWalletButton />
    </header>
  );
}
