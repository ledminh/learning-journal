import { getDatesOfMonth } from "@/data/api/date";

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response("Bad request", { status: 400 });
  }

  const reqBody = (await request.json()) as unknown;

  if (typeof reqBody !== "object") {
    return new Response("Request body should be an object", { status: 400 });
  }

  const { date } = reqBody as {
    date: string;
  };

  if (!date) {
    return new Response("Request body should has date property", {
      status: 400,
    });
  }

  const { errorMessage, payload } = await getDatesOfMonth(new Date(date));

  if (errorMessage) {
    return new Response(errorMessage, { status: 500 });
  }

  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json",
    },
  });
}
