import Link from "next/link";
export default function TagsPage() {
  return (
    <>
      <h2>List of tags</h2>
      <ul>
        <li>
          <Link href="/tag/01">Tag 01</Link>
        </li>
        <li>
          <Link href="/tag/02">Tag 02</Link>
        </li>
        <li>
          <Link href="/tag/03">Tag 03</Link>
        </li>
      </ul>
    </>
  );
}
