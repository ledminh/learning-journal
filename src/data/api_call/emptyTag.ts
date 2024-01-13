import { EmptyTagFunction } from "@/data/api/types";
import post from "./post";

const emptyTag: EmptyTagFunction = async ({ name }) => {
  return await post({
    url: "/api/tag/empty",
    body: {
      name,
    },
  });
};

export default emptyTag;
