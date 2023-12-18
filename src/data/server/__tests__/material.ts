import {
  createMaterial,
  generateDataForMaterialLinkContent,
  uploadImage,
  deleteImage,
} from "../material";

import { MaterialType } from "../types/material";
import * as dbServerType from "@/data/db_server/types";

describe("server/material", () => {
  it("should create new material", async () => {
    const { errorMessage, payload } = await createMaterial({
      type: MaterialType.QUOTE,
      content: "This is a quote",
    });

    expect(errorMessage).toBeNull();

    expect(payload).toEqual({
      type: dbServerType.MaterialType.Quote,
      content: "This is a quote",
    });

    const { errorMessage: errorMessage2, payload: payload2 } =
      await createMaterial({
        type: MaterialType.CODE,
        content: "console.log('Hello World!')",
      });

    expect(errorMessage2).toBeNull();

    expect(payload2).toEqual({
      type: dbServerType.MaterialType.Code,
      content: "console.log('Hello World!')",
    });
  });

  it("should generate data for material link content", async () => {
    const { errorMessage, payload } = await generateDataForMaterialLinkContent({
      url: "https://www.google.com",
    });

    expect(errorMessage).toBeNull();

    expect(payload).toEqual({
      url: "https://www.google.com",
      title: "Google",
      description:
        "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.",
      imageUrls: expect.any(Array),
    });
  });
});
