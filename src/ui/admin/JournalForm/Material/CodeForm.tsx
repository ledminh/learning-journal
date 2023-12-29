import {
  DataToCreateMaterial,
  MaterialType,
} from "@/data/server/types/material";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, useEffect } from "react";

const CodeForm: React.FC<{
  setMaterial: (material: DataToCreateMaterial | null) => void;
}> = ({ setMaterial }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setMaterial(null);
  }, []);

  useEffect(() => {
    if (value === "") return setMaterial(null);

    const material: DataToCreateMaterial = {
      type: MaterialType.CODE,
      content: value,
    };
    setMaterial(material);
  }, [value]);

  return (
    <label className="flex flex-col gap-1">
      <span className="font-semibold">Code</span>
      <CodeEditor
        value={value}
        language="js"
        placeholder="Enter your JS code here ..."
        onChange={(evn) => setValue(evn.target.value)}
        disabled
        padding={15}
        style={{
          backgroundColor: "#000",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          resize: "none",
          height: "300px",
          fontSize: "16px",
          overflowY: "auto",
        }}
      />
    </label>
  );
};

export default CodeForm;
