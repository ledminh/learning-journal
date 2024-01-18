import { DeleteTagFunction } from "@/data/api/types";
import post from "./post";

const deleteTag: DeleteTagFunction = async ({ name }) => {
  return await post({
    url: "/api/tag/delete",
    body: {
      name,
    },
    revalidate: true,
  });
};

export default deleteTag;
