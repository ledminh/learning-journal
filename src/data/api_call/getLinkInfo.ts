import post from "./post";
import { GenerateDataForMaterialLinkContentFunction } from "../server/types/material";

export const getLinkInfo: GenerateDataForMaterialLinkContentFunction = async ({
  url,
}) =>
  await post({
    url: "/api/get_link_info",
    body: {
      url,
    },
  });
