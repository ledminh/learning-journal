import type { JournalEntry as JournalEntryType } from "@/data/server/types/journal_entry";

import FullEntry from "./FullEntry";
import Summary from "./Summary";

export default function JournalEntry(props: {
  type: "full" | "summary";
  journalEntry: JournalEntryType;
}) {
  if (props.type === "full") return <FullEntry />;
  else return <Summary journalEntry={props.journalEntry} />;
}
