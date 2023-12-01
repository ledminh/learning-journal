import Link from "next/link";
import Entry from "@/entry";

export default function TagPage(props: { params: { tag_name: string } }) {
  return (
    <>
      <p>Tag {props.params.tag_name}</p>
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <Link href="/entry/01">
              <Entry type="summary" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
