import { AsyncFunction } from "../types";

type PostFunction = AsyncFunction<
  {
    url: string;
    body: any;
  },
  any
>;

const post: PostFunction = async function ({ url, body }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log(response);

  if (!response.ok) {
    return {
      errorMessage: response.statusText,
      payload: null,
    };
  }

  const payload = await response.json();

  return {
    errorMessage: null,
    payload,
  };
};

export default post;
