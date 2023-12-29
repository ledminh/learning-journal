import getLinkInfo from "../utils/getLinkInfo";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  DataToCreateMaterial,
  MaterialType,
} from "@/data/server/types/material";

const LinkForm: React.FC<{
  setMaterial: (material: DataToCreateMaterial | null) => void;
}> = ({ setMaterial }) => {
  const [status, setStatus] = useState<"unInit" | "loading" | "loaded">(
    "unInit"
  );

  const [currentUrl, setCurrentUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [currentDescription, setCurrentDescription] = useState<string | null>(
    null
  );

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [imageUrls, setImageUrls] = useState<string[] | null>(null);

  useEffect(() => {
    setMaterial(null);
    setStatus("unInit");
    setCurrentUrl("");
    setErrorMessage(null);
    setCurrentTitle(null);
    setCurrentDescription(null);
    setCurrentImageUrl(null);
    setImageUrls(null);
  }, []);

  useEffect(() => {
    if (status === "loaded") {
      const material: DataToCreateMaterial = {
        type: MaterialType.LINK,
        content: {
          title: currentTitle!,
          description: currentDescription!,
          url: currentUrl,
          imageUrl: currentImageUrl!,
        },
      };
      setMaterial(material);
    }
  }, [status, currentTitle, currentDescription, currentUrl, currentImageUrl]);

  const _getLinkInfo = async () =>
    await getLinkInfo({
      currentUrl,
      setStatus,
      setErrorMessage,
      setCurrentTitle,
      setCurrentDescription,
      setCurrentImageUrl,
      setImageUrls,
    });

  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">URL</span>
        <input
          type="text"
          className="p-2 border border-black rounded-md"
          placeholder="Type a URL"
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
        />
      </label>
      <div className="flex items-center justify-end">
        <button
          className="flex items-center justify-between px-2 py-1 text-white bg-gray-700 rounded-md shadow-md hover:bg-gray-900 flex-nowrap"
          onClick={_getLinkInfo}
        >
          <span>GET LINK INFO</span>
        </button>
      </div>
      {errorMessage && (
        <div className="flex items-center justify-center">
          <span className="font-mono text-sm text-red-500">{errorMessage}</span>
        </div>
      )}
      {status === "loading" && (
        <div className="flex items-center justify-center">
          <span className="text-2xl">Loading...</span>
        </div>
      )}
      {status === "loaded" && (
        <div className="flex flex-col gap-4 p-4 bg-gray-300 rounded-lg">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Title</span>
            <input
              type="text"
              className="p-2 border border-black rounded-md"
              placeholder="Type a title"
              value={currentTitle || ""}
              onChange={(e) => setCurrentTitle(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Description</span>
            <textarea
              className="p-2 border border-black rounded-md resize-none"
              placeholder="Type a description"
              rows={5}
              value={currentDescription || ""}
              onChange={(e) => setCurrentDescription(e.target.value)}
            />
          </label>
          {imageUrls!.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center bg-gray-200 border-4 border-gray-600 w-60 h-60">
                <Image
                  src={currentImageUrl || ""}
                  alt="image"
                  width={200}
                  height={200}
                />
              </div>
              <ul className="flex flex-wrap gap-2">
                {imageUrls!.map((url) => (
                  <li key={url}>
                    <button
                      className={`flex items-center justify-center w-16 h-16 bg-gray-200 border-4 ${
                        currentImageUrl === url
                          ? "border-red-600"
                          : "border-gray-600"
                      } hover:opacity-50`}
                      onClick={() => setCurrentImageUrl(url)}
                    >
                      <Image src={url} alt="image" width={50} height={50} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LinkForm;
