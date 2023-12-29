import {
  DataToCreateMaterial,
  MaterialType,
} from "@/data/server/types/material";
import generateDescription from "./utils/generateDescription";

import { useState } from "react";

const Description: React.FC<{
  description: string;
  setDescription: (description: string) => void;
  title: string;
  content: string;
  material: DataToCreateMaterial | null;
}> = function ({ title, content, material, description, setDescription }) {
  const [loading, setLoading] = useState(false);

  const generateDesc = () => {
    generateDescription({
      title,
      content,
      material: material || {
        type: MaterialType.QUOTE,
        content: "This is a placeholder quote because there is no material.",
      },
      setDescription,
      setLoading,
    });
  };

  return (
    <>
      <textarea
        className="p-2 text-sm bg-gray-300 border border-black resize-none"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          className="flex items-center justify-between px-2 py-1 text-white bg-gray-700 rounded-md shadow-md hover:bg-gray-900 flex-nowrap"
          onClick={generateDesc}
        >
          <span>GENERATE DESCRIPTION</span>
          {loading && (
            <span className="ml-2">
              <svg
                className="w-5 h-5 text-white animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default Description;
