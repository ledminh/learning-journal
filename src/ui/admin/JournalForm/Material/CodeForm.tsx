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

  const [language, setLanguage] = useState("js");

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
    <label className="flex flex-col gap-3">
      <span className="font-semibold">Code</span>
      <CodeEditor
        value={value}
        language={language}
        placeholder={`// Write your ${language} code here...`}
        onChange={(evn) => setValue(evn.target.value)}
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
      <div className="flex">
        <select
          className="p-2 border border-black rounded-md"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="js">JavaScript</option>
          <option value="bash">Bash</option>
        </select>
      </div>
    </label>
  );
};

export default CodeForm;
