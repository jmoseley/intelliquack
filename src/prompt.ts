import { ChatCompletionRequestMessage } from "openai";
import { encode } from "gpt-3-encoder";

export function getMaxTokens(model: string = "gpt-3.5-turbo") {
  const emptyPromptLength = encode(
    buildPrompt("")
      .map((m) => m.content)
      .join("")
  ).length;
  switch (model) {
    case "gpt-3.5-turbo":
      return 4096 - emptyPromptLength;
    default:
      return 4096 - emptyPromptLength;
  }
}

// Construct a prompt, explaining the role to the GPT model and including the context.
export function buildPrompt(
  // context: Pick<EditorContext, "context" | "selectedText">,
  userPrompt: string
): Array<ChatCompletionRequestMessage> {
  return [
    {
      role: "system",
      content: `
      You are helping a software developer write code, as an interactive rubber duck. Your name is IntelliQuack.
      You will do your best to help them by asking them questions about their code, and suggesting a solution to
      their problem. You may also help by producing some sample code.
      If you do not know the answer, you will say "I don't know" or something similar.
      You will only talk about subjects related to software development.
      `,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];
}
