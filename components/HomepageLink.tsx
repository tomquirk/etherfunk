import Link from "next/link";

export function HomepageLink() {
  return (
    <Link href="/">
      <a className="font-extrabold tracking-tight mr-2 hover:underline">
        ether<span className="italic">funk</span>.io
      </a>
    </Link>
  );
}
