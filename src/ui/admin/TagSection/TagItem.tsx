import { Tag } from "@/data/server/types/tag";
import Link from "next/link";
import { FC } from "react";

const TagItem: FC<Tag> = (tag) => (
  <Link
    href={`/admin/tag/${tag.slug}`}
    className="px-3 py-1 border border-neutral-700 hover:bg-neutral-200 rounded-xl"
  >
    <span>{tag.name}</span>
  </Link>
);

export default TagItem;
