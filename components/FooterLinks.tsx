export function FooterLinks() {
  return (
    <div className="flex items-center justify-center gap-x-10 flex-wrap">
      <a
        href="https://twitter.com/aeolianeth"
        className="text-sm hover:underline text-slate-500 hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        @aeolianeth
      </a>
      <a
        href="https://juicebox.money/@etherfunkio"
        className="text-sm hover:underline text-slate-500 hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        Juicebox
      </a>
      <a
        href="https://t.me/etherfunk"
        className="text-sm hover:underline text-slate-500 hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </a>
      <a
        href="https://github.com/tomquirk/etherfunk"
        className="text-sm hover:underline text-slate-500 hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </div>
  );
}
