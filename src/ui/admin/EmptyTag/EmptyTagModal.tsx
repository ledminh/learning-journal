import ModalWrapper from "@/ui/admin/ModalWrapper";

import { useRef } from "react";
import { Tag } from "@/data/server/types/tag";

import emptyTag from "@/data/api_call/emptyTag";

const EmptyTagModal: React.FC<{
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  tag: Tag;
  afterEmpty: () => void;
  setLoading: (loading: boolean) => void;
}> = function ({ openModal, setOpenModal, tag, afterEmpty, setLoading }) {
  const inputRef = useRef(null);

  const onSubmit = async () => {
    setLoading(true);

    const { errorMessage } = await emptyTag({ name: tag.name });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    afterEmpty();
    setLoading(false);
  };

  return (
    <ModalWrapper
      open={openModal}
      setOpen={setOpenModal}
      initialFocus={inputRef}
      title="Empty Tag"
      submitButton={{
        text: "Empty",
        onClick: onSubmit,
        className: "bg-red-950 text-white",
      }}
      panelClassName="border-8 border-red-800"
    >
      <div className="mt-4">
        Do you want to <span className="font-bold text-red-800">delete</span>{" "}
        all the journals in the tag{" "}
        <span className="font-bold">"{tag.name}"</span>?
      </div>
    </ModalWrapper>
  );
};

export default EmptyTagModal;
