import JournalEntryList from "@/ui/JournalList";
import { MaterialOption } from "@/ui/types";

interface Props {
  searchParams: {
    keyword?: string;
    sortBy?: "date" | "title";
    order?: "asc" | "desc";
    material?: MaterialOption;
  };
}

export default function Home({ searchParams }: Props) {
  return <JournalEntryList {...searchParams} />;
}