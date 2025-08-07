import { chatClient } from "@/lib/chat-client";

type ChatParamns = {
  query: string;
  history?: unknown[];
  apiKey: string | null;
};

export const sendQuery = async ({ query, history, apiKey }: ChatParamns) => {
  return chatClient
    .post("/chat",
      { query, history },
      {
        headers: {
          "x-anthropic-api-key": apiKey,
        },
      }
    )
    .then((response) => response.data);
};
