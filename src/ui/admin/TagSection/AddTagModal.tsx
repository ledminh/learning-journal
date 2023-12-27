import { Tag } from "@/data/server/types/tag";

import { addTags } from "@/data/api_call/tag";
import ModalWrapper from "../ModalWrapper";

import { useRef, useState } from "react";

const AddTagModal: React.FC<{
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  afterAdd: (tags: Tag[]) => void;
  setLoading: (loading: boolean) => void;
}> = function ({ openModal, setOpenModal, afterAdd, setLoading }) {
  const inputRef = useRef(null);
  const [tagName, setTagName] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    const { errorMessage, payload: tags } = await addTags({ names: [tagName] });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    setTagName("");
    afterAdd(tags!);
    setLoading(false);
  };

  return (
    <ModalWrapper
      open={openModal}
      setOpen={setOpenModal}
      initialFocus={inputRef}
      title="Add New Tag"
      onSubmit={onSubmit}
    >
      <div className="mt-2 text-sm text-gray-500">
        <label htmlFor="tag-name" className="sr-only">
          Tag name
        </label>
        <input
          type="text"
          name="tag-name"
          id="tag-name"
          className="block w-full p-2 text-base border border-gray-300 rounded-md shadow-sm outline-none focus:ring-gray-900 focus:border-gray-900 focus:border-2"
          placeholder="Tag name"
          ref={inputRef}
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
      </div>
    </ModalWrapper>
  );
};

export default AddTagModal;
