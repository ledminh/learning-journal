import { FC, useState } from "react";
import AddTagModal from "./AddTagModal";
import { Tag } from "@/data/server/types/tag";

const AddNewTag: FC<{
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  afterAdd: (tags: Tag[]) => void;
}> = function ({ setLoading, isLoading, afterAdd }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        className="p-2 border border-neutral-700 hover:bg-blue-300"
        onClick={() => setOpenModal(true)}
        disabled={openModal || isLoading}
      >
        <span>Add New Tag</span>
      </button>
      <AddTagModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        afterAdd={afterAdd}
        setLoading={setLoading}
      />
    </>
  );
};

export default AddNewTag;
