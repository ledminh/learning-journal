import {
  DataToCreateMaterial,
  Material,
  MaterialType,
} from "@/data/server/types/material";
import generateDescription from "./utils/generateDescription";

import { useState } from "react";
import Spinner from "@/ui/Spinner";

const Description: React.FC<{
  description: string;
  setDescription: (description: string) => void;
  title: string;
  content: string;
  material: DataToCreateMaterial | Material | null;
}> = function ({ title, content, material, description, setDescription }) {
  const [loading, setLoading] = useState(false);

  const generateDesc = () => {
    generateDescription({
      title,
      content,
      material: material ?? {
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
              <Spinner />
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default Description;
