import {
  MaterialType,
  Material,
  DataToCreateMaterial,
} from "@/data/server/types/material";
import MaterialForm from "./MaterialForm";
import { useEffect, useState } from "react";

const MaterialComponent: React.FC<{
  setMaterial: (material: DataToCreateMaterial | Material | null) => void;
  material: DataToCreateMaterial | Material | null;
}> = ({ setMaterial, material }) => {
  const [currentType, setCurrentType] = useState<MaterialType>(
    MaterialType.LINK
  );

  useEffect(() => {
    if (material) {
      setCurrentType(material.type);
    }
  }, [material]);

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
        <MaterialForm
          type={currentType}
          setMaterial={setMaterial}
          material={material}
        />
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
