import { useState, useEffect } from "react";
import Image from "next/image";

import {
  DataToCreateMaterial,
  MaterialType,
} from "@/data/server/types/material";

const ImageForm: React.FC<{
  setMaterial: (material: DataToCreateMaterial | null) => void;
}> = ({ setMaterial }) => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setMaterial(null);
  }, []);

  useEffect(() => {
    if (!file) return setMaterial(null);

    const material: DataToCreateMaterial = {
      type: MaterialType.IMAGE,
      content: file,
    };
    setMaterial(material);
  }, [file]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <label className="flex items-center justify-center py-2 cursor-pointer hover:text-blue-500">
        <span className="font-semibold">{file ? "Change" : "Add"} Image</span>
        <input
          type="file"
          className="hidden border border-black"
          onChange={(e) => setFile(e.target.files![0])}
        />
      </label>
      {file && (
        <div className="relative w-60 h-60">
          <Image
            src={URL.createObjectURL(file)}
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
