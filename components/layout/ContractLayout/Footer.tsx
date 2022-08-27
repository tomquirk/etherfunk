import { FooterLinks } from "../../FooterLinks";

export function Footer() {
  return (
    <footer className="py-3 px-8 border-t border-slate-200 text-sm text-slate-500 hidden md:block">
      <FooterLinks />
    </footer>
  );
}
