import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

const Content: React.FC<{
  content: string;
  setContent: (content: string) => void;
}> = ({ content, setContent }) => {
  return (
    <>
      <MDEditor
        value={content}
        onChange={(val) => setContent(val || "")}
        style={{
          backgroundColor: "#000",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          resize: "none",
          fontSize: "16px",
          overflowY: "auto",
        }}
        height={500}
      />
    </>
  );
};

export default Content;
