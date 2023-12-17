import OpenAI from "openai";

const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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",
});

export async function askGPT(question: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a useful assistant, skilled in summarize materials including programming codes and text in to short description.",
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return completion.choices[0].message.content;
}
