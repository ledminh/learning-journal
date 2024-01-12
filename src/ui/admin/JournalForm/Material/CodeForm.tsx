import {
  DataToCreateMaterial,
  Material,
  MaterialType,
} from "@/data/server/types/material";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState } from "react";

const CodeForm: React.FC<{
  setMaterial: (material: DataToCreateMaterial | null) => void;
  material: DataToCreateMaterial | Material | null;
}> = ({ setMaterial, material }) => {
  const [language, setLanguage] = useState("js");

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const material: DataToCreateMaterial = {
      type: MaterialType.CODE,
      content: e.target.value,
    };
    setMaterial(material);
  };

  return (
    <label className="flex flex-col gap-3">
      <span className="font-semibold">Code</span>
      <CodeEditor
        value={material === null ? "" : (material.content as string)}
        language={language}
        placeholder={`// Write your ${language} code here...`}
        onChange={onChange}
        padding={15}
        style={{
          backgroundColor: "#000",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          resize: "none",
          height: "300px",
          fontSize: "16px",
          overflowY: "scroll",
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
