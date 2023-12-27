"use client";

import { FC, useState } from "react";

import { Tag } from "@/data/server/types/tag";

import AddNewTag from "./AddNewTag";
import TagList from "./TagList";

const Content: FC<{
  tags: Tag[];
}> = ({ tags: initTags }) => {
  const [isLoading, setLoading] = useState(false);
  const [tags, setTags] = useState(initTags);

  const afterAdd = (tags: Tag[]) => {
    setTags(tags);
  };

  return (
    <>
      <AddNewTag
        isLoading={isLoading}
        setLoading={setLoading}
        afterAdd={afterAdd}
      />
      <TagList tags={tags} isLoading={isLoading} />
    </>
  );
};

export default Content;
