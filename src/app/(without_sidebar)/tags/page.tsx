import { getTags } from "@/data/api/tag";
import Link from "next/link";
export default async function TagsPage() {
  const { errorMessage, payload } = await getTags({});

  if (errorMessage) {
    return (
      <Wrapper title="Error loading tags">
        <p>{errorMessage}</p>
      </Wrapper>
    );
  }

  if (!payload) {
    return (
      <Wrapper title="Error loading tags">
        <p>Something wrong with the payload</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper title="All tags">
      <ul className="flex flex-wrap gap-2">
        {payload.map((tag) => (
          <li
            key={tag.id}
            className="px-2 py-1 bg-blue-100 rounded-md hover:bg-blue-300"
          >
            <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
}

/*************************
 * Helpers
 */
const Wrapper = (props: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) => (
  <div className={`flex flex-col gap-4 ${props.className}`}>
    <h2 className="p-2 text-xl font-semibold bg-neutral-300">{props.title}</h2>
    {props.children}
  </div>
);
