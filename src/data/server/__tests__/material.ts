import {
  createMaterial,
  generateDataForMaterialLinkContent,
} from "../material";

describe("server/material", () => {
  it.skip("should create new material", () => {});

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
