import ModalWrapper from "@/ui/admin/ModalWrapper";

import { useRef, useState } from "react";
import updateTag from "@/data/api_call/updateTag";
import { Tag } from "@/data/server/types/tag";

const RenameTagModal: React.FC<{
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  tag: Tag;
  afterRename: (newTagName: string) => void;
  setLoading: (loading: boolean) => void;
}> = function ({ openModal, setOpenModal, tag, afterRename, setLoading }) {
  const inputRef = useRef(null);

  const [newName, setNewName] = useState(tag.name);

  const onSubmit = async () => {
    setLoading(true);

    const { errorMessage } = await updateTag({
      name: tag.name,
      newName,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    afterRename(newName);
  };

  return (
    <ModalWrapper
      open={openModal}
      setOpen={setOpenModal}
      initialFocus={inputRef}
      title="Rename Tag"
      submitButton={{
        text: "Rename",
        onClick: onSubmit,
      }}
    >
      <div className="mt-4">
        Rename the tag <span className="font-bold">"{tag.name}"</span>?
      </div>
      <div className="mt-2 text-sm text-gray-500">
        <label htmlFor="tag-name" className="sr-only">
          Tag name
        </label>
        <input
          type="text"
          name="tag-name"
          id="tag-name"
          className="block w-full p-2 text-base border border-gray-300 rounded-md shadow-sm outline-none focus:ring-gray-900 focus:border-gray-900 focus:border-2"
          placeholder="Enter a new name ..."
          ref={inputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
    </ModalWrapper>
  );
};

export default RenameTagModal;
