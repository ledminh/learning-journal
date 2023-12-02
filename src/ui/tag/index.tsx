import Block from "@/ui/layout/Block";
import Link from "next/link";

export function TagItem() {
  return <div>Tag</div>;
}

export function TagBlock() {
  return (
    <Block title="Tags">
      <p>Tag Blocks</p>
      <Link href="/tags" className="text-blue-800 font-mono underline">
        View all tags
      </Link>
    </Block>
  );
}
