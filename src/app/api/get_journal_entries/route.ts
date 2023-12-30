import { getJournalEntries } from "@/data/api/journal_entry";
import { MaterialType } from "@/data/server/types/material";
export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response("Bad request", { status: 400 });
  }

  const reqBody = (await request.json()) as unknown;

  if (typeof reqBody !== "object") {
    return new Response("Request body should be an object", { status: 400 });
  }

  const { limit, offset, filters, sort } = reqBody as {
    limit?: number;
    offset?: number;
    filters?: {
      materialType?: MaterialType;
      keyword?: string;
    };
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
  };

  const { errorMessage, payload } = await getJournalEntries({
    limit,
    offset,
    filters,
    sort,
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
