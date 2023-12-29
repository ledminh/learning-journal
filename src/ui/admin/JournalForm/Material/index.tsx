import { MaterialType } from "@/data/server/types/material";
import MaterialForm from "./MaterialForm";
import { useState } from "react";

const MaterialComponent: React.FC = () => {
  const [currentType, setCurrentType] = useState<MaterialType>(
    MaterialType.LINK
  );

  return (
    <>
      <ul className="flex gap-2">
        {materialTypes.map((type, i) => (
          <li
            key={i}
            className={`px-2 border border-black rounded-md hover:bg-slate-600 hover:text-gray-200 ${
              type === currentType && "bg-slate-600 text-gray-200"
            }`}
          >
            <button onClick={() => setCurrentType(type)}>
              {MaterialTypeTitle[type]}
            </button>
          </li>
        ))}
      </ul>
      <div className="p-2 border border-black rounded-md">
        <MaterialForm type={currentType} />
      </div>
    </>
  );
};

export default MaterialComponent;

/****************************
 * Helpers
 */

const materialTypes: MaterialType[] = Object.values(MaterialType);

const MaterialTypeTitle: Record<MaterialType, string> = {
  [MaterialType.LINK]: "LINK",
  [MaterialType.CODE]: "CODE",
  [MaterialType.QUOTE]: "QUOTE",
  [MaterialType.IMAGE]: "IMAGE",
};
