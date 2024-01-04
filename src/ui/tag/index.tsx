import { Tag } from "@/data/server/types/tag";
import Block from "@/ui/layout/Block";
import Link from "next/link";

type Props = {
  errorMessage: string | null;
  tags: Tag[] | null;
};

export async function TagBlock({ errorMessage, tags }: Props) {
  return (
    <Block title="Tags">
      <div className="flex flex-col gap-4">
        {errorMessage && (
          <div className="p-2 font-mono text-sm bg-red-100">{errorMessage}</div>
        )}
        {tags && (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.id}>
                  <Link
                    href={`/tag/${tag.slug}`}
                    className="px-2 py-1 font-mono text-sm bg-blue-100 rounded-md hover:bg-blue-300"
                  >
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <Link href="/tags" className="font-mono text-blue-800 underline">
                View all tags
              </Link>
            </div>
          </div>
        )}
      </div>
    </Block>
  );
}
