"use client";

import CodeEditor from "@uiw/react-textarea-code-editor";
import * as serverTypes from "@/data/server/types/material";
import Image from "next/image";
import Link from "next/link";

interface MaterialProps {
  material: serverTypes.Material;
}

export default function Material({ material }: MaterialProps) {
  switch (material.type) {
    case serverTypes.MaterialType.QUOTE:
      return <MaterialQuote content={material.content} />;
    case serverTypes.MaterialType.LINK:
      return <MaterialLink {...material.content} />;

    case serverTypes.MaterialType.IMAGE:
      return (
        <Image
          src={material.content}
          alt={material.content}
          className="rounded-md shadow-sm"
          width={500}
          height={500}
        />
      );

    case serverTypes.MaterialType.CODE:
      return (
        <>
          <CodeEditor
            value={material.content.replace(/"/g, "").replace(/\n/g, "\n")}
            language={"js"}
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
            disabled
          />
        </>
      );

    default:
      return null;
  }
}

/*************************
 * Components
 */

const MaterialQuote = (props: { content: string }) => (
  <blockquote className="relative p-6 text-lg italic font-semibold bg-blue-100 text-neutral-900">
    <span className="absolute text-4xl font-bold text-blue-500 top-1 left-1">
      "
    </span>
    <span>{props.content}</span>
    <span className="absolute bottom-0 text-4xl font-bold text-blue-500 right-3">
      "
    </span>
  </blockquote>
);

const MaterialLink = (props: {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
}) => (
  <Link
    className="flex flex-col gap-3 p-4 rounded-md shadow-sm bg-slate-200 shadow-black hover:bg-slate-300"
    href={props.url}
  >
    <Image src={props.imageUrl} alt={props.title} width={400} height={400} />
    <div className="flex flex-col gap-1">
      <h4 className="font-bold">{props.title}</h4>
      <p className="text-sm italic">{props.description}</p>
    </div>
  </Link>
);
