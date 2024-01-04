"use client";

import MenuButton from "./MenuButton";
import { useState } from "react";

const MobileSideBar: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [shown, setShown] = useState(false);

  return (
    <>
      <MenuButton open={() => setShown(true)} />
      <div
        className={`fixed top-0 bottom-0 animation duration-300  bg-white z-50 ${
          shown ? "right-0" : "-right-[100%]"
        } h-full p-4 border-4 border-l-black flex flex-col gap-4`}
      >
        <div className="flex flex-row justify-end">
          <button
            className="flex items-center justify-center w-10 h-10 text-xl text-white bg-black rounded-full hover:bg-black/80"
            onClick={() => setShown(false)}
          >
            X
          </button>
        </div>

        {children}
      </div>
    </>
  );
};

export default MobileSideBar;
