import { deleteJournalEntry } from "@/data/api/journal_entry";

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response("Bad request", { status: 400 });
  }

  const reqBody = (await request.json()) as unknown;

  if (typeof reqBody !== "object") {
    return new Response("Request body should be an object", { status: 400 });
  }

  const { id } = reqBody as {
    id: string;
  };

  const { errorMessage } = await deleteJournalEntry({
    id,
  });

  if (errorMessage) {
    return new Response(errorMessage, { status: 500 });
  }

  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
