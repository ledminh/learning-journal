import { Fragment, FC, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Modal: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  initialFocus?: React.MutableRefObject<null>;
  title: string;
  onCancel?: () => void;
  submitButton: {
    text: string;
    onClick: () => void;
    className?: string;
  };
  panelClassName?: string;
  children: React.ReactNode;
}> = ({
  open,
  setOpen,
  initialFocus,
  onCancel,
  submitButton,
  title,
  panelClassName,
  children,
}) => {
  const cancelRef = useRef(null);

  const initialFocusRef = initialFocus || cancelRef;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={initialFocusRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-opacity-90 bg-gray-950" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-gray-200 rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6${
                  panelClassName ? " " + panelClassName : ""
                }`}
              >
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-center text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  {children}
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className={`inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-1${
                      submitButton.className ? " " + submitButton.className : ""
                    }`}
                    onClick={() => {
                      submitButton.onClick();
                      setOpen(false);
                    }}
                  >
                    {submitButton.text}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm hover:bg-white/60 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-2 sm:mt-0"
                    onClick={() => {
                      onCancel && onCancel();
                      setOpen(false);
                    }}
                    ref={cancelRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
