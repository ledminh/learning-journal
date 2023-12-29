import {
  MaterialType,
  Material,
  DataToCreateMaterial,
} from "@/data/server/types/material";
import LinkForm from "./LinkForm";

const MaterialForm: React.FC<{
  type: MaterialType;
  setMaterial: (material: DataToCreateMaterial | null) => void;
  material: DataToCreateMaterial | null;
}> = ({ type, setMaterial, material }) => (
  <div className="flex flex-col gap-2">
    {(() => {
      switch (type) {
        case MaterialType.LINK:
          return <LinkForm setMaterial={setMaterial} />;
        case MaterialType.CODE:
          return <CodeForm />;
        case MaterialType.IMAGE:
          return <ImageForm />;
        case MaterialType.QUOTE:
          return <QuoteForm />;
        default:
          throw new Error("Invalid material type");
      }
    })()}
  </div>
);

export default MaterialForm;

/**************************
 * Sub Forms
 */

const CodeForm: React.FC = () => {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-semibold">Code</span>
      <textarea
        className="p-2 bg-gray-100 border border-black resize-none"
        rows={5}
      />
    </label>
  );
};

const QuoteForm: React.FC = () => {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-semibold">Quote</span>
      <textarea
        className="p-2 bg-gray-100 border border-black resize-none"
        rows={5}
      />
    </label>
  );
};

const ImageForm: React.FC = () => {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-semibold">Image</span>
      <input type="file" className="border border-black" />
    </label>
  );
};
