import ModalWrapper from "@/ui/admin/ModalWrapper";

import { useRef } from "react";
import deleteJournalEntry from "@/data/api_call/deleteJournalEntry";
import { JournalEntry } from "@/data/server/types/journal_entry";

const DeleteJournalModal: React.FC<{
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  journalEntry: JournalEntry;
  afterDelete: () => void;
  setLoading: (loading: boolean) => void;
}> = function ({
  openModal,
  setOpenModal,
  journalEntry,
  afterDelete,
  setLoading,
}) {
  const inputRef = useRef(null);

  const onSubmit = async () => {
    setLoading(true);

    const { errorMessage } = await deleteJournalEntry(journalEntry);

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    afterDelete();
  };

  return (
    <ModalWrapper
      open={openModal}
      setOpen={setOpenModal}
      initialFocus={inputRef}
      title="Delete Journal"
      submitButton={{
        text: "Delete",
        onClick: onSubmit,
        className: "bg-red-950 text-white",
      }}
      panelClassName="border-8 border-red-800"
    >
      <div className="mt-4">
        Do you want to <span className="font-bold text-red-800">delete</span>{" "}
        the journal <span className="font-bold">"{journalEntry.title}"</span>?
      </div>
    </ModalWrapper>
  );
};

export default DeleteJournalModal;
