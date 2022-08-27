import { Badge } from "../../Badge";
import { HomepageLink } from "../../HomepageLink";
import Nav from "../Nav";

export function DesktopSidebar() {
  return (
    <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0  border-r border-slate-100">
      <div className="flex flex-col flex-grow pt-5 px-4 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 pl-2">
          <div className="flex items-center">
            <HomepageLink />
            <Badge>Beta</Badge>
          </div>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 pb-4 space-y-1 pt-4">
            <Nav />
          </nav>
        </div>
      </div>
    </div>
  );
}
