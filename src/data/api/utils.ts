type PostParams<P> = {
  url: string;
} & (
  | {
      type: "file";
      payload: {
        file: File;
      };
    }
  | {
      type: "json";
      payload: {
        json: P;
      };
    }
);

export async function post<R, P = {}>(params: PostParams<P>) {
  const { url, type, payload } = params;

  if (type === "file") {
    const formData = new FormData();
    formData.append("file", payload.file);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return null;
    }

    const retVal = (await response.json()) as R;

    return retVal;
  }

  if (type === "json") {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload.json),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const retVal = (await response.json()) as R;

    return retVal;
  }

  throw new Error("Invalid type");
}
