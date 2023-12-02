import JournalEntry from "@/ui/journal_entry";
import Link from "next/link";

export default function Home() {
  return (
    <ul className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i}>
          <Link href="/entry/01">
            <JournalEntry type="summary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
