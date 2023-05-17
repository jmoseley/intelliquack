import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

let client: OpenAIApi | undefined = undefined;

export function configure(apiKey: string) {
  if (!client) {
    const configuration = new Configuration({
      apiKey,
    });
    client = new OpenAIApi(configuration);
  }
  return client;
}

export async function createCompletion(
  messages: ChatCompletionRequestMessage[]
) {
  if (!client) {
    throw new Error("OpenAI client not configured");
  }

  console.log("Creating completion");
  try {
    const result = await client.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    console.error((error as any).response.data);
    throw error;
  }
}
