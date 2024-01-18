import { UpdateTagFunction } from "@/data/api/types";
import post from "./post";

const updateTag: UpdateTagFunction = async ({ name, newName }) => {
  return await post({
    url: "/api/tag/update",
    body: {
      name,
      newName,
    },
    revalidate: true,
  });
};

export default updateTag;
