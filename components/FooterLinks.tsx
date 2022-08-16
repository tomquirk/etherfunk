export function FooterLinks() {
  return (
    <div className="flex items-center justify-center">
      <a
        href="https://twitter.com/aeolianeth"
        className="text-sm hover:text-blue-800 text-slate-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        @aeolianeth
      </a>
      <span className="mx-2 text-slate-400 font-light">|</span>
      <a
        href="https://juicebox.money/v2/p/163"
        className="text-sm hover:text-blue-800 text-slate-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        Support
      </a>
    </div>
  );
}
