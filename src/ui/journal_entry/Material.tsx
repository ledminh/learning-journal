"use client";

import CodeEditor from "@uiw/react-textarea-code-editor";
import * as serverTypes from "@/data/server/types/material";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

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
      return <MaterialImage src={material.content} alt={material.content} />;

    case serverTypes.MaterialType.CODE:
      return (
        <div className="w-full">
          <CodeEditor
            value={material.content}
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
        </div>
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

const MaterialImage = (props: { src: string; alt: string }) => {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        className="flex items-center justify-center w-full h-full"
        onClick={() => setOpenModal(true)}
      >
        <Image
          src={props.src}
          alt={props.alt}
          className="rounded-md shadow-sm"
          width={500}
          height={500}
        />
      </button>
      <div
        className={`fixed inset-0 z-10 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-60 ${
          openModal ? "" : "hidden"
        }`}
        onClick={() => setOpenModal(false)}
      >
        <button
          className="absolute top-0 right-0 p-2 text-white bg-red-900"
          onClick={() => setOpenModal(false)}
        >
          close
        </button>
        <Image
          src={props.src}
          alt={props.alt}
          className="rounded-md shadow-sm"
          width={1000}
          height={1000}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </>
  );
};
