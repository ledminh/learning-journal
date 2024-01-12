import { generateJournalEntryDescription } from "@/data/server/helpers";
import { DataToCreateMaterial, Material } from "@/data/server/types/material";

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response(
      `Bad request. The content-type should be "application/json".
      It is ${request.headers.get("content-type")} now`,
      { status: 400 }
    );
  }

  const reqBody = (await request.json()) as unknown;

  if (typeof reqBody !== "object") {
    return new Response("Request body should be an object", { status: 400 });
  }

  const { title, content, material } = reqBody as {
    title: string;
    content: string;
    material: DataToCreateMaterial | Material;
  };

  if (title === undefined || content === undefined || material === undefined) {
    return new Response(
      `Request body should has ${
        !title ? "title" : !content ? "content" : "material"
      } property`,
      {
        status: 400,
      }
    );
  }

  const { errorMessage, payload } = await generateJournalEntryDescription({
    title,
    content,
    material,
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
