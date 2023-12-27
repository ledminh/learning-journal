import JournalForm from "@/ui/admin/JournalForm";
import { getTags } from "@/data/api/tag";

export default async function AddNewJournal() {
  const { errorMessage, payload: dbTags } = await getTags({});

  if (errorMessage) {
    return (
      <Wrapper>
        <p className="text-red-600">{errorMessage}</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <JournalForm dbTags={dbTags!} />
    </Wrapper>
  );
}

/**************************
 * Style Component(s)
 */

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-4">
    <h2 className="p-2 text-lg font-semibold bg-neutral-200">
      Add new journal
    </h2>
    {children}
  </div>
);
