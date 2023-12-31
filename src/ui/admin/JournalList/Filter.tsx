"use client";

import { useState, useEffect } from "react";
import { useQueryString } from "@/ui/utils";

import type { MaterialOption } from "@/ui/types";

const Filter: React.FC<{
  material?: MaterialOption;
}> = ({ material }) => {
  const [isVisble, setIsVisible, toggle] = useToggle(false);
  const { currentMaterial, options } = useOptions(toggle, material);

  useEffect(() => {
    // Close when user press Esc
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVisible(false);
    };

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <div className="relative basis-1/2">
      <button
        className="block w-full p-2 text-white bg-neutral-500 hover:bg-neutral-700"
        onClick={toggle}
      >
        Filter: {currentMaterial ?? "All"}
      </button>
      <div
        className={`${
          isVisble ? "absolute" : "hidden"
        } z-10 w-full p-2 bg-white border rounded-lg shadow-xl border-neutral-700 flex gap-2 flex-wrap justify-between mt-1`}
      >
        {options.map((option) => (
          <button
            key={option.label}
            className={`block p-2 text-white basis-full sm:basis-[48%] lg:basis-full ${
              option.label === currentMaterial
                ? "bg-neutral-900"
                : "bg-neutral-500"
            } hover:bg-neutral-700`}
            onClick={option.onClick}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;

/*************************
 * Hooks
 */

const useToggle = (initialState: boolean) => {
  const [state, setState] = useState(initialState);
  const toggle = () => setState((state) => !state);
  return [state, setState, toggle] as const;
};

const useOptions = (
  toggle: (isVisble: boolean) => void,
  material?: MaterialOption
) => {
  const options: Record<string, MaterialOption>[] = [
    { material: "quote" },
    { material: "code" },
    { material: "image" },
    { material: "link" },
  ];

  const { addQueryString, deleteQueryString } = useQueryString();

  const [currentMaterial, setCurrentMaterial] = useState<MaterialOption | null>(
    material ?? null
  );

  const onClick = (option: Record<string, MaterialOption>) => {
    if (option.material === currentMaterial) {
      setCurrentMaterial(null);
      deleteQueryString(["material"]);
      toggle(false);
      return;
    }

    addQueryString(option);
    setCurrentMaterial(option.material);
    toggle(false);
  };

  return {
    currentMaterial,
    options: options.map((option) => ({
      label: `${option.material}`,
      onClick: () => onClick(option),
    })),
  };
};
