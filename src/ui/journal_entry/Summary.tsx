import { JournalEntry } from "@/data/server/types/journal_entry";

interface Props {
  journalEntry: JournalEntry;
}

const Summmary: React.FC<Props> = ({ journalEntry }) => (
  <Wrapper>
    <h2 className="text-xl font-bold border-b text-neutral-700 border-b-neutral-700">
      {journalEntry.title}
    </h2>
    <div className="flex gap-2 italic">
      <span className="font-bold text-neutral-500">Date: </span>
      <span>{journalEntry.createdAt.toLocaleDateString()}</span>
    </div>
    <div className="flex flex-row flex-wrap gap-2">
      <span>Tags:</span>
      {journalEntry.tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 mx-1 text-sm rounded-lg bg-neutral-200"
        >
          {tag}
        </span>
      ))}
    </div>
    <p className="text-sm">{journalEntry.description}</p>
  </Wrapper>
);

export default Summmary;
/*******************
 * Components
 */

const Wrapper = (props: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 p-2 border border-slate-400 hover:bg-slate-300">
    {props.children}
  </div>
);
