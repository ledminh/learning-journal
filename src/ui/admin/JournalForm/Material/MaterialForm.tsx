import {
  MaterialType,
  DataToCreateMaterial,
} from "@/data/server/types/material";

import LinkForm from "./LinkForm";
import ImageForm from "./ImageForm";
import QuoteForm from "./QuoteForm";
import CodeForm from "./CodeForm";

const MaterialForm: React.FC<{
  type: MaterialType;
  setMaterial: (material: DataToCreateMaterial | null) => void;
}> = ({ type, setMaterial }) => (
  <div className="flex flex-col gap-2">
    {(() => {
      switch (type) {
        case MaterialType.LINK:
          return <LinkForm setMaterial={setMaterial} />;
        case MaterialType.CODE:
          return <CodeForm setMaterial={setMaterial} />;
        case MaterialType.IMAGE:
          return <ImageForm setMaterial={setMaterial} />;
        case MaterialType.QUOTE:
          return <QuoteForm setMaterial={setMaterial} />;
        default:
          throw new Error("Invalid material type");
      }
    })()}
  </div>
);

export default MaterialForm;
