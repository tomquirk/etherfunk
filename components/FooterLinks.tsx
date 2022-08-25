export function FooterLinks() {
  return (
    <div className="flex items-center justify-center">
      <a
        href="https://twitter.com/aeolianeth"
        className="text-sm hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        @aeolianeth
      </a>
      <span className="mx-2 text-slate-400 font-light">|</span>
      <a
        href="https://juicebox.money/@etherfunkio"
        className="text-sm hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fund
      </a>
      <span className="mx-2 text-slate-400 font-light">|</span>
      <a
        href="https://t.me/etherfunk"
        className="text-sm hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </a>
    </div>
  );
}
