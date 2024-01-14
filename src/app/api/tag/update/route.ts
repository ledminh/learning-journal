import { updateTag } from "@/data/api/tag";

import authenticate from "@/utils/authenticate";

export async function POST(request: Request) {
  const { errorMessage: authErrorMessage } = await authenticate();

  if (authErrorMessage) {
    return new Response(authErrorMessage, { status: 401 });
  }

  if (request.headers.get("content-type") !== "application/json") {
    return new Response("Bad request", { status: 400 });
  }

  const reqBody = (await request.json()) as unknown;

  if (typeof reqBody !== "object") {
    return new Response("Request body should be an object", { status: 400 });
  }

  const { name, newName } = reqBody as { name: string; newName: string };

  if (!name || !newName) {
    return new Response("Request body should has name and newName properties", {
      status: 400,
    });
  }

  const { errorMessage, payload } = await updateTag({ name, newName });

  if (errorMessage) {
    return new Response(errorMessage, { status: 500 });
  }

  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json",
    },
  });
}
