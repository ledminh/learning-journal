import { Tag } from "@/data/server/types/tag";
import { DataToConnectTag } from "@/data/server/types/journal_entry";
import { useState } from "react";

const AddTags: React.FC<{
  dbTags: Tag[];
  dataToConnectTags: DataToConnectTag[];
  setDataToConnectTags: (dataToConnectTags: DataToConnectTag[]) => void;
}> = ({
  dbTags,
  dataToConnectTags: dtaCTags,
  setDataToConnectTags: setDtaCTags,
}) => {
  const [inputValue, setInputValue] = useState("");

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim() === "") return;

      const tag = dbTags.find((tag) => tag.name === inputValue);

      if (!tag) {
        setDtaCTags([
          ...dtaCTags,
          {
            name: inputValue,
            id: null,
          },
        ]);
      } else if (!dtaCTags.find((dtaCTag) => dtaCTag.id === tag.id)) {
        setDtaCTags([
          ...dtaCTags,
          {
            name: null,
            id: tag.id,
          },
        ]);
      }

      setInputValue("");
    }
  };

  const deleteDtaCTag = (tag: DataToConnectTag) => {
    setDtaCTags(dtaCTags.filter((dtaCTag) => dtaCTag !== tag));
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="p-2 border border-black rounded-md"
        list="tags"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <datalist id="tags">
        {dbTags.map((tag) => (
          <option key={tag.id} value={tag.name} />
        ))}
      </datalist>
      {dtaCTags.length > 0 && (
        <ul className="flex flex-wrap gap-2 p-2 bg-blue-200 rounded-lg">
          {dtaCTags.map((tag) => (
            <li
              className="inline-block px-2 py-1 text-sm font-semibold border border-black rounded-md hover:border-blue-600 hover:shadow-md"
              key={tag.id || tag.name}
            >
              <span>
                {tag.name || dbTags.find((dbTag) => dbTag.id === tag.id)!.name}
              </span>
              <button onClick={() => deleteDtaCTag(tag)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-4 h-4 ml-2 hover:text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.707 10l4.147 4.146a.5.5 0 01-.708.708L10 10.707l-4.146 4.147a.5.5 0 11-.708-.708L9.293 10 5.146 5.854a.5.5 0 11.708-.708L10 9.293l4.146-4.147a.5.5 0 11.708.708L10.707 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddTags;
