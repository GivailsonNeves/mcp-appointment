"use client";

import { ChatSidebar } from "@/components/app/chat-sidebar";
import { useNavigation } from "@/hooks/useNavigation";
import { sendQuery } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

type ChatContextType = {
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

type MessageParam = {
  role: "user" | "assistant";
  content: string;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProviderProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [conversation, setConversation] = useState<MessageParam[]>([]);
  const [history, setHistory] = useState<MessageParam[] | undefined>(undefined);

  const { processInteraction } = useNavigation();

  const { mutate, isPending } = useMutation({
    mutationFn: (query: string) =>
      sendQuery({
        query,
        history,
      }),
    onSuccess: (data: MessageParam[]) => {
      if (data.length && data.at(-1)) {
        const lastMessage: any = data.at(-1);
        const llmsAnswer = lastMessage.content?.[0].text
          ? JSON.parse(lastMessage.content[0].text)
          : {};

        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            content: llmsAnswer.llm_response,
          },
        ]);

        if (interactiveMode) {
          
          // console.log({
          //   success: llmsAnswer.success,
          //   tool_name: llmsAnswer.tool_name,
          //   tool_params: llmsAnswer.tool_params,
          // });
          if (llmsAnswer.success && llmsAnswer.tool_name) {
            processInteraction(llmsAnswer.tool_name, llmsAnswer.tool_params);
          } else {
            console.error(
              llmsAnswer.success,
              "No interactions available for:",
              llmsAnswer.tool_name
            );
          }
        }
      }
      setHistory(data || []);
    },
    onError: (error: any) => {
      console.error("Error during chat mutation:", error);
    },
  });

  const onSubmitQuery = (query: string) => {
    if (!query.trim()) return;
    setConversation((prev) => [...prev, { role: "user", content: query }]);
    mutate(query);
  };

  return (
    <ChatContext.Provider
      value={{
        show: () => setOpen(true),
        hide: () => setOpen(false),
        toggle: () => setOpen((prev) => !prev),
      }}
    >
      <ChatSidebar
        {...{
          open,
          conversation,
          onSubmitQuery,
          setOpen,
          interactiveMode,
          setInteractiveMode,
          isPending,
          children,
        }}
      />
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
