import { getLinkInfo as apiGetLinkInfo } from "@/data/api_call/getLinkInfo";

interface GetLinkInfoProps {
  currentUrl: string;
  setStatus: (status: "unInit" | "loading" | "loaded") => void;
  setErrorMessage: (errorMessage: string | null) => void;
  setCurrentTitle: (title: string) => void;
  setCurrentDescription: (description: string) => void;
  setImageUrls: (imageUrls: string[]) => void;
  setCurrentImageUrl: (imageUrl: string) => void;
}

const getLinkInfo = async ({
  currentUrl,
  setStatus,
  setErrorMessage,
  setCurrentTitle,
  setCurrentDescription,
  setImageUrls,
  setCurrentImageUrl,
}: GetLinkInfoProps) => {
  setErrorMessage(null);
  setStatus("loading");

  const { errorMessage, payload } = await apiGetLinkInfo({
    url: processUrl(currentUrl),
  });

  if (errorMessage) {
    setStatus("unInit");
    setErrorMessage(errorMessage);
  } else {
    setStatus("loaded");

    setCurrentTitle(payload!.title);
    setCurrentDescription(payload!.description);

    setImageUrls(payload!.imageUrls);

    setCurrentImageUrl(payload!.imageUrls[0] ?? "");
  }
};

export default getLinkInfo;

/*****************************
 * Process url
 */

export const processUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  } else {
    return `https://${url}`;
  }
};
