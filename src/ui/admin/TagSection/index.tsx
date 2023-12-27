import { FC } from "react";
import { getTags } from "@/data/api/tag";
import Content from "./Content";

const TagSection: FC = async () => {
  const { errorMessage, payload: tags } = await getTags({});

  if (errorMessage !== null) {
    return <Wrapper>{errorMessage}</Wrapper>;
  }

  return (
    <Wrapper>
      <Content tags={tags!} />
    </Wrapper>
  );
};

export default TagSection;

/***************************
 * Style Components
 */
const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="flex flex-col items-start justify-start gap-2 p-4 bg-blue-200 rounded-xl">
    {children}
  </section>
);
