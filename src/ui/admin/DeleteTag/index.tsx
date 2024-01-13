"use client";

import { useEffect, useState } from "react";
import DeleteTagModal from "./DeleteTagModal";
import { Tag } from "@/data/server/types/tag";

import { useRouter } from "next/navigation";

const DeleteTag: React.FC<{
  tag: Tag;
}> = ({ tag }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (tag.journalEntries.length !== 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [tag.journalEntries]);

  const afterDelete = () => {
    router.back();
  };

  return (
    <>
      <button
        className={`px-2 py-1  ${
          disabled
            ? "bg-transparent border border-neutral-500 cursor-not-allowed text-neutral-500"
            : "bg-red-900 text-white"
        }`}
        onClick={() => !disabled && setOpenModal(true)}
        disabled={openModal}
      >
        delete
      </button>
      <DeleteTagModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        tag={tag}
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

export default DeleteTag;
