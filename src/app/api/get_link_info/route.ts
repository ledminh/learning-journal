import { generateDataForMaterialLinkContent } from "@/data/server/material";

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response("Bad request", { status: 400 });
  }

  const reqBody = (await request.json()) as unknown;

  if (typeof reqBody !== "object") {
    return new Response("Request body should be an object", { status: 400 });
  }

  const { url } = reqBody as {
    url: string;
  };

  if (!url) {
    return new Response(`Request body should has a "url" property`, {
      status: 400,
    });
  }

  const { errorMessage, payload } = await generateDataForMaterialLinkContent({
    url,
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
