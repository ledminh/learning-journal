"use client";

import { useState } from "react";
import RenameTagModal from "./RenameTagModal";
import { Tag } from "@/data/server/types/tag";

import { useRouter } from "next/navigation";

const RenameTag: React.FC<{
  tag: Tag;
}> = ({ tag }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const afterRename = (newTagName: string) => {
    router.push(`/admin/tag/${newTagName}`);
  };

  return (
    <>
      <button
        className="px-2 py-1 text-white bg-neutral-500"
        onClick={() => setOpenModal(true)}
        disabled={openModal}
      >
        rename
      </button>
      <RenameTagModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        tag={tag}
        afterRename={afterRename}
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

export default RenameTag;
