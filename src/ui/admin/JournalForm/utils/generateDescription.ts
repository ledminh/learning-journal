import { generateJEDescription } from "@/data/api_call/generateJEDescription";
import { DataToCreateMaterial } from "@/data/server/types/material";

interface Props {
  title: string;
  content: string;
  material: DataToCreateMaterial;
  setDescription: (description: string) => void;
  setLoading: (loading: boolean) => void;
}

const generateDescription = async ({
  title,
  content,
  material,
  setDescription,
  setLoading,
}: Props) => {
  setLoading(true);

  const { errorMessage, payload } = await generateJEDescription({
    title,
    content,
    material,
  });

  setLoading(false);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  setDescription(payload!.description);
};

export default generateDescription;
