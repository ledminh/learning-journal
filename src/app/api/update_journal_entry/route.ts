import { updateJournalEntry } from "@/data/api/journal_entry";

import { MaterialType } from "@/data/server/types/material";

export async function POST(request: Request) {
  const reqForm = await request.formData();

  const reqBody = Object.fromEntries(reqForm.entries());

  if (!reqBody) {
    return new Response("Request body is empty", { status: 400 });
  }

  const id = reqBody.id as string;
  const title = reqBody.title as string;
  const slug = reqBody.slug as string;
  const tags = reqBody.tags as string;
  const description = reqBody.description as string;

  const content = reqBody.content as string;

  if (!title || !content || !tags || !description) {
    return new Response(
      `Request body should has ${
        !title ? "title" : !content ? "content" : !tags ? "tags" : "description"
      } property`,
      {
        status: 400,
      }
    );
  }

  const materialID =
    (reqBody.materialID as string) === "null"
      ? null
      : (reqBody.materialID as string);

  const materialType = materialID
    ? undefined
    : (reqBody.materialType as MaterialType);

  let materialData = materialID
    ? {
        id: materialID,
      }
    : {
        id: null,
        type: materialType!,
        content:
          materialType === MaterialType.IMAGE
            ? reqForm.get("materialContent")
            : materialType === MaterialType.LINK
            ? JSON.parse(reqBody.materialContent as string)
            : reqBody.materialContent,
      };

  const { errorMessage, payload } = await updateJournalEntry({
    id,
    title,
    slug,
    tags: JSON.parse(tags),
    description,
    material: materialData,
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
