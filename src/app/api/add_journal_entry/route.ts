import { addJournalEntry } from "@/data/api/journal_entry";
import { DataToCreateJournalEntry } from "@/data/server/types/journal_entry";

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response("Bad request", { status: 400 });
  }

  const reqBody = (await request.json()) as unknown;

  if (typeof reqBody !== "object") {
    return new Response("Request body should be an object", { status: 400 });
  }

  const { title, content, material, tags, description } =
    reqBody as DataToCreateJournalEntry;

  if (!title || !content || !material || !tags || !description) {
    return new Response(
      `Request body should has ${
        !title
          ? "title"
          : !content
          ? "content"
          : !material
          ? "material"
          : !tags
          ? "tags"
          : "description"
      } property`,
      {
        status: 400,
      }
    );
  }

  const { errorMessage, payload } = await addJournalEntry({
    title,
    tags,
    description,
    material,
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
