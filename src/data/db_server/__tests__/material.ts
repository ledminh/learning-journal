import {
  addMaterial,
  updateMaterial,
  deleteMaterial,
} from "@/data/db_server/material"; // Update the path to your module

import { MaterialType } from "@/types/material";

describe.skip("Material functions", () => {
  it("should add, update and delete  QUOTE material successfully", async () => {
    const quoteMaterial = {
      type: MaterialType.Quote,
      content: "This is a quote.",
    };

    const result = await addMaterial(quoteMaterial);

    expect(result.errorMessage).toBeNull();
    expect(result.payload).toBeTruthy();

    expect(typeof result.payload?.id).toBe("string");
    expect(result.payload?.type).toBe(MaterialType.Quote);
    expect(result.payload?.content).toBe("This is a quote.");

    const updatedMaterial = {
      id: result.payload?.id as string,
      type: MaterialType.Quote,
      content: "This is an updated quote.",
      createdAt: result.payload?.createdAt as Date,
    };

    const updatedResult = await updateMaterial(updatedMaterial);

    expect(updatedResult.errorMessage).toBeNull();
    expect(updatedResult.payload).toBeTruthy();

    expect(typeof updatedResult.payload?.id).toBe("string");
    expect(updatedResult.payload?.type).toBe(MaterialType.Quote);
    expect(updatedResult.payload?.content).toBe("This is an updated quote.");

    const deletedResult = await deleteMaterial({
      id: updatedResult.payload?.id as string,
    });

    expect(deletedResult.errorMessage).toBeNull();
    expect(deletedResult.payload).toBeTruthy();

    expect(typeof deletedResult.payload?.id).toBe("string");
    expect(deletedResult.payload?.type).toBe(MaterialType.Quote);
    expect(deletedResult.payload?.content).toBe("This is an updated quote.");
  });

  it("should add, update and delete LINK material successfully", async () => {
    const linkMaterial = {
      type: MaterialType.Link,
      content: "https://www.google.com",
    };

    const result = await addMaterial(linkMaterial);

    expect(result.errorMessage).toBeNull();
    expect(result.payload).toBeTruthy();

    expect(typeof result.payload?.id).toBe("string");
    expect(result.payload?.type).toBe(MaterialType.Link);
    expect(result.payload?.content).toBe("https://www.google.com");

    const updatedMaterial = {
      id: result.payload?.id as string,
      type: MaterialType.Link,
      content: "https://www.facebook.com",
      createdAt: result.payload?.createdAt as Date,
    };

    const updatedResult = await updateMaterial(updatedMaterial);

    expect(updatedResult.errorMessage).toBeNull();
    expect(updatedResult.payload).toBeTruthy();

    expect(typeof updatedResult.payload?.id).toBe("string");
    expect(updatedResult.payload?.type).toBe(MaterialType.Link);
    expect(updatedResult.payload?.content).toBe("https://www.facebook.com");

    const deletedResult = await deleteMaterial({
      id: updatedResult.payload?.id as string,
    });

    expect(deletedResult.errorMessage).toBeNull();
    expect(deletedResult.payload).toBeTruthy();

    expect(typeof deletedResult.payload?.id).toBe("string");
    expect(deletedResult.payload?.type).toBe(MaterialType.Link);
    expect(deletedResult.payload?.content).toBe("https://www.facebook.com");
  });

  it("should add, update and delete CODE material successfully", async () => {
    const codeMaterial = {
      type: MaterialType.Code,
      content: "console.log('Hello World!')",
    };

    const result = await addMaterial(codeMaterial);

    expect(result.errorMessage).toBeNull();
    expect(result.payload).toBeTruthy();

    expect(typeof result.payload?.id).toBe("string");
    expect(result.payload?.type).toBe(MaterialType.Code);
    expect(result.payload?.content).toBe("console.log('Hello World!')");

    const updatedMaterial = {
      id: result.payload?.id as string,
      type: MaterialType.Code,
      content: "console.log('Hello World! Updated')",
      createdAt: result.payload?.createdAt as Date,
    };

    const updatedResult = await updateMaterial(updatedMaterial);

    expect(updatedResult.errorMessage).toBeNull();
    expect(updatedResult.payload).toBeTruthy();

    expect(typeof updatedResult.payload?.id).toBe("string");
    expect(updatedResult.payload?.type).toBe(MaterialType.Code);
    expect(updatedResult.payload?.content).toBe(
      "console.log('Hello World! Updated')"
    );

    const deletedResult = await deleteMaterial({
      id: updatedResult.payload?.id as string,
    });

    expect(deletedResult.errorMessage).toBeNull();
    expect(deletedResult.payload).toBeTruthy();

    expect(typeof deletedResult.payload?.id).toBe("string");
    expect(deletedResult.payload?.type).toBe(MaterialType.Code);
    expect(deletedResult.payload?.content).toBe(
      "console.log('Hello World! Updated')"
    );
  });

  it("should add, update and delete IMAGE material successfully", async () => {
    const imageMaterial = {
      type: MaterialType.Image,
      content: "https://www.google.com",
    };

    const result = await addMaterial(imageMaterial);

    expect(result.errorMessage).toBeNull();
    expect(result.payload).toBeTruthy();

    expect(typeof result.payload?.id).toBe("string");
    expect(result.payload?.type).toBe(MaterialType.Image);
    expect(result.payload?.content).toBe("https://www.google.com");

    const updatedMaterial = {
      id: result.payload?.id as string,
      type: MaterialType.Image,
      content: "https://www.facebook.com",
      createdAt: result.payload?.createdAt as Date,
    };

    const updatedResult = await updateMaterial(updatedMaterial);

    expect(updatedResult.errorMessage).toBeNull();
    expect(updatedResult.payload).toBeTruthy();

    expect(typeof updatedResult.payload?.id).toBe("string");
    expect(updatedResult.payload?.type).toBe(MaterialType.Image);
    expect(updatedResult.payload?.content).toBe("https://www.facebook.com");

    const deletedResult = await deleteMaterial({
      id: updatedResult.payload?.id as string,
    });

    expect(deletedResult.errorMessage).toBeNull();
    expect(deletedResult.payload).toBeTruthy();

    expect(typeof deletedResult.payload?.id).toBe("string");
    expect(deletedResult.payload?.type).toBe(MaterialType.Image);
    expect(deletedResult.payload?.content).toBe("https://www.facebook.com");
  });
});
