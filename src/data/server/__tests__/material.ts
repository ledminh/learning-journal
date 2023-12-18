import fs from "fs";

import {
  createMaterial,
  generateDataForMaterialLinkContent,
  uploadImage,
  deleteImage,
} from "../material";

import { MaterialType } from "../types/material";
import * as dbServerType from "@/data/db_server/types";

describe.skip("server/material", () => {
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

    const { errorMessage: errorMessage3, payload: payload3 } =
      await createMaterial({
        type: MaterialType.IMAGE,
        content: new File([], "image.jpg", { type: "image/jpg" }),
      });

    expect(errorMessage3).toBeNull();

    expect(payload3).toHaveProperty("type", dbServerType.MaterialType.Image);
    expect(payload3).toHaveProperty("content");
    console.log(payload3);

    const { errorMessage: errorMessage4, payload: payload4 } =
      await createMaterial({
        type: MaterialType.LINK,
        content: {
          url: "https://www.google.com",
          title: "Google",
          description:
            "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.",
          imageUrl:
            "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
        },
      });

    expect(errorMessage4).toBeNull();

    expect(payload4).toHaveProperty("type", dbServerType.MaterialType.Link);

    expect(payload4).toHaveProperty("content");
    expect(typeof payload4?.content).toBe("string");

    const content = JSON.parse(payload4?.content as string);

    expect(content).toHaveProperty("url", "https://www.google.com");
    expect(content).toHaveProperty("title", "Google");
    expect(content).toHaveProperty(
      "description",
      "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for."
    );

    expect(content).toHaveProperty(
      "imageUrl",
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
    );
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

  it("should upload image and then delete image", async () => {
    // Prepare a real image file
    const imageBin = fs.readFileSync(
      "./src/data/server/__tests__/test-photo.png"
    );
    const imageFile = new File([imageBin], "testImage.jpg", {
      type: "image/png",
    });

    // Run the function with the real file
    const response = await uploadImage({ imageFile: imageFile });

    // Assertions
    expect(response).toHaveProperty("errorMessage", null);
    expect(response).toHaveProperty("payload.imageUrl");

    expect(response.payload).toEqual({
      imageUrl: expect.any(String),
    });

    // Delete the image
    const { errorMessage, payload } = await deleteImage({
      imageUrl: response?.payload?.imageUrl as string,
    });

    // Assertions
    expect(errorMessage).toBeNull();
    expect(payload).toStrictEqual({
      success: true,
    });
  });
});
