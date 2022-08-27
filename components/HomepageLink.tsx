import Image from "next/image";
import Link from "next/link";

export function HomepageLink() {
  return (
    <Link href="/">
      <a className="font-extrabold text-lg tracking-tight mr-2 hover:underline flex items-center">
        <Image
          src="/etherfunk-logo-32x32.png"
          width={32}
          height={32}
          alt="Etherfunk logo"
          className="rounded"
        />
        <span className="ml-2">
          ether
          <span className="italic">funk</span>.io
        </span>
      </a>
    </Link>
  );
}
