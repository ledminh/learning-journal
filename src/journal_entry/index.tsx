import FullEntry from "./FullEntry";
import Summary from "./Summary";

export default function JournalEntry(props: { type: "full" | "summary" }) {
  if (props.type === "full") return <FullEntry />;
  else return <Summary />;
}