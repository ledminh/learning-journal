"use client";

import { useState } from "react";
import DeleteJournalModal from "./DeleteJournalModal";
import { JournalEntry } from "@/data/server/types/journal_entry";

import { useRouter } from "next/navigation";

const DeleteJournal: React.FC<{
  journalEntry: JournalEntry;
}> = ({ journalEntry }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const afterDelete = () => {
    router.back();
  };

  return (
    <>
      <button
        className="px-2 py-1 text-white bg-red-900"
        onClick={() => setOpenModal(true)}
        disabled={openModal}
      >
        delete
      </button>
      <DeleteJournalModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        journalEntry={journalEntry}
        afterDelete={afterDelete}
        setLoading={setLoading}
      />
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-60">
          <div className="w-20 h-20 border-4 border-gray-900 border-dashed rounded-full loader animate-spin-slow"></div>
        </div>
      )}
    </>
  );
};

export default DeleteJournal;
