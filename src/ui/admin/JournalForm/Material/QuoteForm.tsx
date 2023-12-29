import {
  DataToCreateMaterial,
  MaterialType,
} from "@/data/server/types/material";

import { useState, useEffect } from "react";

const QuoteForm: React.FC<{
  setMaterial: (material: DataToCreateMaterial | null) => void;
}> = ({ setMaterial }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setMaterial(null);
  }, []);

  useEffect(() => {
    if (value === "") return setMaterial(null);

    const material: DataToCreateMaterial = {
      type: MaterialType.QUOTE,
      content: value,
    };
    setMaterial(material);
  }, [value]);

  return (
    <label className="flex flex-col gap-1">
      <span className="font-semibold">Quote</span>
      <textarea
        className="p-2 bg-gray-100 border border-black resize-none"
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
};

export default QuoteForm;
