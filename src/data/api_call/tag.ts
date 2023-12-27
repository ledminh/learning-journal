import { AsyncFunction } from "../types";
import { Tag } from "@/data/server/types/tag";

import post from "./post";

type AddTagFunction = AsyncFunction<
  {
    names: string[];
  },
  Tag[]
>;

export const addTags: AddTagFunction = async function ({ names }) {
  const { errorMessage, payload } = await post({
    url: "api/tag/add",
    body: {
      names,
    },
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};
