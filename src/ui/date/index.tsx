import Link from "next/link";
import Block from "@/ui/layout/Block";

export function DateBlock() {
  return (
    <Block title="Date">
      <p>DateBlock</p>
      <Link href="/dates" className="text-blue-800 font-mono underline">
        View all dates
      </Link>
    </Block>
  );
}
