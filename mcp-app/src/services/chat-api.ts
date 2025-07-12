import { chatClient } from "@/lib/chat-client";

type ChatParamns = {
  query: string;
  history?: unknown[];
};

type ChatResponse = {
  role: "user" | "assistant";
  content: {
    type: string;
    text: string;
    input: { [key: string]: unknown } | undefined;
    content: {
      type: "tool_use" | "tool_result";
      content: {
        type: string;
        text: string;
      };
    };
  }[];
};

export const sendQuery = async (paramns: ChatParamns) => {
  return (
    chatClient.post("/chat", paramns).then((response) => response.data)
  );
};
