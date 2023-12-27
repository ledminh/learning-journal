import { FC, useEffect, useState } from "react";
import { Tag } from "@/data/server/types/tag";
import TagItem from "./TagItem";

const TagList: FC<{ tags: Tag[]; isLoading: boolean }> = ({
  tags: _tags,
  isLoading,
}) => {
  const [isFull, setIsFull] = useState(false);
  const [tags, setTags] = useState(isFull ? _tags : _tags.slice(0, 5));

  useEffect(() => {
    setTags(isFull ? _tags : _tags.slice(0, 5));
  }, [_tags, isFull]);

  if (tags.length === 0)
    return (
      <div className="text-center">
        <p className="text-gray-500">No tags found.</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="text-center">
        <p className="text-gray-500">Loading ...</p>
      </div>
    );

  return (
    <ul className="flex flex-wrap">
      {tags!.map((tag) => {
        return (
          <li key={tag.slug} className="inline-block mt-2 mr-2">
            <TagItem {...tag} />
          </li>
        );
      })}
      {_tags.length > 5 && (
        <li className="inline-block mt-2 mr-2">
          <button
            className="px-2 text-sm text-white bg-blue-500 rounded-xl hover:bg-blue-800"
            onClick={() => setIsFull(!isFull)}
          >
            {isFull ? "Show Less" : "Show More"}
          </button>
        </li>
      )}
    </ul>
  );
};

export default TagList;
