import { askGPT } from "../openai";

describe("openai", () => {
  it("should return a completion", async () => {
    const message = await askGPT("What is the meaning of life?");
    expect(message).toBeDefined();

    console.log(message);
  });
});
