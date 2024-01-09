import { addJournalEntry } from "@/data/api/journal_entry";

import { MaterialType } from "@/data/server/types/material";

export async function POST(request: Request) {
  const reqForm = await request.formData();

  const reqBody = Object.fromEntries(reqForm.entries());

  if (!reqBody) {
    return new Response("Request body is empty", { status: 400 });
  }

  const title = reqBody.title as string;
  const content = reqBody.content as string;
  const tags = reqBody.tags as string;
  const description = reqBody.description as string;
  const materialType = reqBody.materialType as MaterialType;

  if (!title || !content || !materialType || !tags || !description) {
    return new Response(
      `Request body should has ${
        !title
          ? "title"
          : !content
          ? "content"
          : !materialType
          ? "materialType"
          : !tags
          ? "tags"
          : "description"
      } property`,
      {
        status: 400,
      }
    );
  }

  const materialContent =
    materialType === MaterialType.IMAGE
      ? reqForm.get("materialContent")
      : materialType === MaterialType.LINK
      ? JSON.parse(reqBody.materialContent as string)
      : reqBody.materialContent;

  const { errorMessage, payload } = await addJournalEntry({
    title,
    tags: JSON.parse(tags),
    description,
    material: {
      type: materialType,
      content: materialContent,
    },
    content,
  });

  if (errorMessage) {
    return new Response(errorMessage, { status: 500 });
  }

  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json",
    },
  });
}
