import { JournalEntry } from "@/data/server/types/journal_entry";

interface Props {
  journalEntry: JournalEntry;
}

const Summmary: React.FC<Props> = ({ journalEntry }) => (
  <Wrapper>
    <h2>{journalEntry.title}</h2>
    <p>{journalEntry.tags}</p>
    <p>{journalEntry.description}</p>
  </Wrapper>
);

export default Summmary;
/*******************
 * Components
 */

const Wrapper = (props: { children: React.ReactNode }) => (
  <div className="p-2 border border-slate-400">{props.children}</div>
);
