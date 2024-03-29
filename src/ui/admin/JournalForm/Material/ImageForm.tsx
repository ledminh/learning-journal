import Image from "next/image";

import {
  DataToCreateMaterial,
  Material,
  MaterialType,
} from "@/data/server/types/material";

const ImageForm: React.FC<{
  setMaterial: (material: DataToCreateMaterial | Material | null) => void;
  material: DataToCreateMaterial | Material | null;
}> = ({ setMaterial, material }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const material: DataToCreateMaterial = {
      type: MaterialType.IMAGE,
      content: e.target.files![0],
    };
    setMaterial(material);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <label className="flex items-center justify-center p-4 bg-blue-300 cursor-pointer hover:text-white hover:bg-blue-500">
        <span className="font-semibold">
          {material ? "Change" : "Add"} Image
        </span>
        <input
          type="file"
          className="hidden border border-black"
          onChange={onChange}
        />
      </label>
      {material && (
        <div className="relative w-full h-[200px] border-8 border-gray-600 p-2">
          <Image
            src={
              material.content instanceof File
                ? URL.createObjectURL(material.content)
                : (material.content as string)
            }
            alt="image material"
            fill
            className="object-cover w-full h-full rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageForm;
