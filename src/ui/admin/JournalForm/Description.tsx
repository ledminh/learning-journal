import { generateJEDescription } from "@/data/api_call/generateJEDescription";
import { MaterialType } from "@/data/server/types/material";

const Description: React.FC<{
  description: string;
  setDescription: (description: string) => void;
}> = function ({ description, setDescription }) {
  const generateDescription = async () => {
    /****
     * TODO:
     * 1. Add a loading state
     * 2. Add a error state
     */

    const { errorMessage, payload } = await generateJEDescription({
      title: "This is a title",
      content: "This is a content",
      material: {
        id: "1234",
        type: MaterialType.QUOTE,
        content: "This is a quote material",
      },
    });

    setDescription("This is a description");
  };
  return (
    <>
      <textarea
        className="p-2 text-sm bg-gray-300 border border-black resize-none"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          className="px-2 py-1 text-white bg-gray-700 rounded-md shadow-md hover:bg-gray-900"
          onClick={generateDescription}
        >
          GENERATE DESCRIPTION
        </button>
      </div>
    </>
  );
};

export default Description;
