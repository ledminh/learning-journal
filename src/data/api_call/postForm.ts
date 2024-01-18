import { AsyncFunction } from "@/types";

type PostFormFunction = AsyncFunction<
  {
    url: string;
    data: Record<string, any>;
    revalidate?: boolean;
  },
  any
>;

const postForm: PostFormFunction = async ({ url, data, revalidate }) => {
  const form = new FormData();

  for (const key in data) {
    form.append(key, data[key]);
  }

  const response = await fetch(url, {
    method: "POST",
    body: form,
    next: {
      revalidate: revalidate ? 60 : false,
    },
  });

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

export default postForm;
