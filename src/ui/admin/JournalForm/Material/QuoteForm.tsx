import {
  DataToCreateMaterial,
  Material,
  MaterialType,
} from "@/data/server/types/material";

const QuoteForm: React.FC<{
  setMaterial: (material: DataToCreateMaterial | Material | null) => void;
  material: DataToCreateMaterial | Material | null;
}> = ({ setMaterial, material }) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const material: DataToCreateMaterial = {
      type: MaterialType.QUOTE,
      content: e.target.value,
    };
    setMaterial(material);
  };

  return (
    <label className="flex flex-col gap-1">
      <span className="font-semibold">Quote</span>
      <textarea
        className="p-2 bg-gray-100 border border-black resize-none"
        rows={5}
        value={material === null ? "" : (material.content as string)}
        onChange={onChange}
      />
    </label>
  );
};

export default QuoteForm;
