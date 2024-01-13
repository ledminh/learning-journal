import ModalWrapper from "@/ui/admin/ModalWrapper";

import { useRef } from "react";
import { Tag } from "@/data/server/types/tag";

import deleteTag from "@/data/api_call/deleteTag";

const DeleteTagModal: React.FC<{
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  tag: Tag;
  afterDelete: () => void;
  setLoading: (loading: boolean) => void;
}> = function ({ openModal, setOpenModal, tag, afterDelete, setLoading }) {
  const inputRef = useRef(null);

  const onSubmit = async () => {
    setLoading(true);

    const { errorMessage } = await deleteTag({ name: tag.name });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    afterDelete();
    setLoading(false);
  };

  return (
    <ModalWrapper
      open={openModal}
      setOpen={setOpenModal}
      initialFocus={inputRef}
      title="Delete Tag"
      submitButton={{
        text: "Delete",
        onClick: onSubmit,
        className: "bg-red-950 text-white",
      }}
      panelClassName="border-8 border-red-800"
    >
      <div className="mt-4">
        Do you want to <span className="font-bold text-red-800">delete</span>{" "}
        the tag <span className="font-bold">"{tag.name}"</span>?
      </div>
    </ModalWrapper>
  );
};

export default DeleteTagModal;
