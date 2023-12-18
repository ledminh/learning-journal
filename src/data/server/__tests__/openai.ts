import { askGPT } from "../openai";

describe.skip("openai", () => {
  it("should return a completion", async () => {
    const message = await askGPT("What is the meaning of life?");
    expect(message).toBeDefined();

    console.log(message);
  });
});
